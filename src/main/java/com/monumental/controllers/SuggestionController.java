package com.monumental.controllers;

import com.monumental.controllers.helpers.BulkCreateMonumentRequest;
import com.monumental.exceptions.InvalidZipException;
import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.Monument;
import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.suggestions.BulkCreateSuggestionRepository;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.repositories.suggestions.UpdateSuggestionRepository;
import com.monumental.security.Authentication;
import com.monumental.security.Authorization;
import com.monumental.services.*;
import com.monumental.services.suggestions.BulkCreateSuggestionService;
import com.monumental.services.suggestions.CreateSuggestionService;
import com.monumental.services.suggestions.UpdateSuggestionService;
import com.monumental.util.async.AsyncJob;
import com.monumental.util.csvparsing.MonumentBulkValidationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@RestController
@Transactional
public class SuggestionController {

    @Autowired
    private CreateSuggestionRepository createSuggestionRepository;

    @Autowired
    private UpdateSuggestionRepository updateSuggestionRepository;

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private MonumentRepository monumentRepository;

    @Autowired
    private BulkCreateSuggestionRepository bulkCreateSuggestionRepository;

    @Autowired
    private AsyncJobService asyncJobService;

    @Autowired
    private AwsS3Service awsS3Service;

    @Autowired
    private CreateSuggestionService createSuggestionService;

    @Autowired
    private UpdateSuggestionService updateSuggestionService;

    @Autowired
    private BulkCreateSuggestionService bulkCreateSuggestionService;

    @Autowired
    private EmailService emailService;

    /**
     * Create a new Suggestion for creating a Monument
     * @param createSuggestion - CreateMonumentSuggestion object representing the new Monument suggestion
     * @return CreateMonumentSuggestion - CreateMonumentSuggestion object just saved
     */
    @PostMapping("/api/suggestion/create")
    @PreAuthorize(Authentication.isAuthenticated)
    public CreateMonumentSuggestion suggestMonumentCreation(@RequestBody CreateMonumentSuggestion createSuggestion) {
        return this.createSuggestionRepository.save(createSuggestion);
    }

    /**
     * Create a new Suggestion for updating a Monument, if it exists
     * @param monumentId - Integer ID of the Monument to suggest the update for
     * @param updateSuggestion - UpdateMonumentSuggestion object representing the updated Monument
     * @return UpdateMonumentSuggestion - UpdateMonumentSuggestion object just saved
     * @throws ResourceNotFoundException - If a Monument with the specified monumentId does not exist
     */
    @PostMapping("/api/suggestion/update/{id}")
    @PreAuthorize(Authentication.isAuthenticated)
    public UpdateMonumentSuggestion suggestMonumentUpdate(@PathVariable("id") Integer monumentId,
                                                      @RequestBody UpdateMonumentSuggestion updateSuggestion) {
        Optional<Monument> optional = this.monumentRepository.findById(monumentId);
        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("The requested Monument or Memorial does not exist");
        }
        Monument monument = optional.get();

        updateSuggestion.setMonument(monument);
        return this.updateSuggestionRepository.save(updateSuggestion);
    }

    /**
     * Determine which rows in the specified .csv (or .csv within .zip) file are valid
     * @param request - BulkCreateMonumentRequest object containing the field mapping and the file to process
     * @return BulkCreateResult - Object representing the results of the Bulk Monument Validate operation
     */
    @PostMapping("/api/suggestion/bulk/validate")
    @PreAuthorize(Authorization.isPartnerOrAbove)
    public MonumentBulkValidationResult validateMonumentCSV(@ModelAttribute BulkCreateMonumentRequest request) {
        try {
            BulkCreateMonumentRequest.ParseResult parseResult = request.parse(this.monumentService);
            return this.monumentService.validateMonumentCSV(parseResult.csvFileName, parseResult.csvContents,
                    parseResult.mapping, parseResult.zipFile);
        } catch (InvalidZipException | IOException e) {
            MonumentBulkValidationResult result = new MonumentBulkValidationResult();
            result.setError(e.getMessage());
            return result;
        }
    }

    /**
     * Start the job to create a new Suggestion for bulk-creating Monuments
     * @param request - BulkCreateMonumentRequest object containing the field mapping and the file to process
     * @return AsyncJob - Object containing the id of the job created and the current value of the Future object
     * @throws IOException - If an exception occurs during parsing of the .csv and/or .zip file
     */
    @PostMapping("/api/suggestion/bulk")
    @PreAuthorize(Authorization.isPartnerOrAbove)
    public AsyncJob suggestBulkMonumentCreation(@ModelAttribute BulkCreateMonumentRequest request)
            throws IOException {
        BulkCreateMonumentRequest.ParseResult parseResult = request.parse(this.monumentService);
        MonumentBulkValidationResult validationResult = this.monumentService.validateMonumentCSV(parseResult.csvFileName,
                parseResult.csvContents, parseResult.mapping, parseResult.zipFile);

        /* TODO: This is not a particularly easy way of creating AsyncJobs, I can't think of a way to abstract
         * it away currently because the AsyncJob must be passed to the CompletableFuture method, and the
         * CompletableFuture must be passed to the AsyncJob, making it difficult to do so dynamically
         */
        AsyncJob job = this.asyncJobService.createJob();
        job.setFuture(this.monumentService.parseMonumentBulkValidationResultAsync(validationResult, job));

        return job;
    }

    /**
     * Check the progress of a create BulkCreateMonumentSuggestion job
     * @param id - Id of the job to check
     * @return AsyncJob - Object containing the id of the job and the current value of the Future object
     */
    @GetMapping("/api/suggestion/bulk/progress/{id}")
    @PreAuthorize(Authorization.isPartnerOrAbove)
    public AsyncJob getBulkCreateMonumentSuggestionJob(@PathVariable Integer id) {
        return this.asyncJobService.getJob(id);
    }

    /**
     * Get the final result of a create BulkCreateMonumentSuggestion job. If the job is not completed yet this will wait
     * for it to complete, so be sure to call getBulkCreateMonumentSuggestionJob and check the status before calling
     * this
     * @param id - Id of the job to get the result of
     * @return BulkCreateMonumentSuggestion - BulkCreateMonumentSuggestion created by the job
     * @throws ExecutionException - Can be thrown by Java if the future encountered an exception
     * @throws InterruptedException - Can be thrown by Java if the future encountered an exception
     */
    @GetMapping("/api/suggestion/bulk/result/{id}")
    @PreAuthorize(Authorization.isPartnerOrAbove)
    public BulkCreateMonumentSuggestion getBulkCreateMonumentSuggestionJobResult(@PathVariable Integer id)
            throws ExecutionException, InterruptedException {
        return (BulkCreateMonumentSuggestion) this.asyncJobService.getJob(id).getFuture().get();
    }

    /**
     * Get a CreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion to get
     * @return CreateMonumentSuggestion - CreateMonumentSuggestion object with the specified ID, if it exists
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @GetMapping("/api/suggestion/create/{id}")
    @PreAuthorize(Authentication.isAuthenticated)
    public CreateMonumentSuggestion getCreateMonumentSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        return this.findCreateSuggestion(id);
    }

    /**
     * Get all CreateMonumentSuggestions created by the currently logged in User that are not part of a
     * BulkCreateMonumentSuggestion
     * @return List<CreateMonumentSuggestion> - List of CreateMonumentSuggestions created by the currently logged in
     * User that are not part of a BulkCreateMonumentSuggestion
     * @throws UnauthorizedException - If no User is currently logged in
     */
    @GetMapping("/api/suggestions/create")
    @PreAuthorize(Authentication.isAuthenticated)
    public List<CreateMonumentSuggestion> getCreateMonumentSuggestions() throws UnauthorizedException {
        return this.createSuggestionService.getCreateMonumentSuggestions();
    }

    /**
     * Get an UpdateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the UpdateMonumentSuggestion to get
     * @return UpdateMonumentSuggestion - UpdateMonumentSuggestion object with the specified ID, if it exists
     * @throws ResourceNotFoundException - If an UpdateMonumentSuggestion with the specified ID does not exist
     */
    @GetMapping("/api/suggestion/update/{id}")
    @PreAuthorize(Authentication.isAuthenticated)
    public UpdateMonumentSuggestion getUpdateMonumentSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        return this.findUpdateSuggestion(id);
    }

    /**
     * Get all UpdateMonumentSuggestions created by the currently logged in User
     * @return List<UpdateMonumentSuggestion> - List of UpdateMonumentSuggestions created by the currently logged in
     * User
     * @throws UnauthorizedException - If no User is currently logged in
     */
    @GetMapping("/api/suggestions/update")
    @PreAuthorize(Authentication.isAuthenticated)
    public List<UpdateMonumentSuggestion> getUpdateMonumentSuggestions() throws UnauthorizedException {
        return this.updateSuggestionService.getUpdateMonumentSuggestions();
    }

    /**
     * Get a BulkCreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the BulkCreateMonumentSuggestion to get
     * @return BulkCreateMonumentSuggestion - BulkCreateMonumentSuggestion object with the specified ID, if it exists
     * @throws ResourceNotFoundException - If a BulkCreateMonumentSuggestion with the specified ID does not exist
     */
    @GetMapping("/api/suggestion/bulk/{id}")
    @PreAuthorize(Authorization.isPartnerOrAbove)
    public BulkCreateMonumentSuggestion getBulkCreateMonumentSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        return this.findBulkCreateSuggestion(id);
    }

    /**
     * Get all BulkCreateMonumentSuggestions created by the currently logged in User
     * @return List<BulkCreateMonumentSuggestion> - List of BulkCreateMonumentSuggestions created by the currently
     * logged in User
     * @throws UnauthorizedException - If no User is currently logged in
     */
    @GetMapping("/api/suggestions/bulk")
    @PreAuthorize(Authorization.isPartnerOrAbove)
    public List<BulkCreateMonumentSuggestion> getBulkCreateMonumentSuggestions() throws UnauthorizedException {
        return this.bulkCreateSuggestionService.getBulkCreateMonumentSuggestions();
    }

    /**
     * Approve a CreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion to approve
     * @return CreateMonumentSuggestion - The approved CreateMonumentSuggestion
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/create/{id}/approve")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public CreateMonumentSuggestion approveCreateSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        CreateMonumentSuggestion createSuggestion = this.findCreateSuggestion(id);

        createSuggestion.setIsApproved(true);
        createSuggestion = this.createSuggestionRepository.save(createSuggestion);

        this.emailService.sendCreateSuggestionApprovalEmail(createSuggestion);
        this.monumentService.createMonument(createSuggestion);

        return createSuggestion;
    }

    /**
     * Approve an UpdateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the UpdateMonumentSuggestion to approve
     * @return Monument - The updated Monument
     * @throws ResourceNotFoundException - If an UpdateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/update/{id}/approve")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Monument approveUpdateSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        UpdateMonumentSuggestion updateSuggestion = this.findUpdateSuggestion(id);

        updateSuggestion.setIsApproved(true);
        updateSuggestion = this.updateSuggestionRepository.save(updateSuggestion);

        this.emailService.sendUpdateSuggestionApprovalEmail(updateSuggestion);

        return this.monumentService.updateMonument(updateSuggestion);
    }

    /**
     * Approve a BulkCreateMonumentSuggestion with the specified ID, if it exists
     * Starts the job to create Monuments asynchronously
     * @param id - ID of the BulkCreateMonumentSuggestion to approve
     * @return AsyncJob - Object containing the ID of the job created and the current value of the Future object
     * @throws ResourceNotFoundException - If a BulkCreateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/bulk/{id}/approve")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public AsyncJob approveBulkCreateSuggestion(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        BulkCreateMonumentSuggestion bulkCreateSuggestion = this.findBulkCreateSuggestion(id);

        bulkCreateSuggestion.setIsApproved(true);
        bulkCreateSuggestion = this.bulkCreateSuggestionRepository.save(bulkCreateSuggestion);

        this.emailService.sendBulkCreateSuggestionApprovalEmail(bulkCreateSuggestion);

        /* TODO: This is not a particularly easy way of creating AsyncJobs, I can't think of a way to abstract
        *  it away currently because the AsyncJob must be passed to the CompletableFuture method and the CompletableFuture
        * must be passed to the AsyncJob, making it difficult to do so dynamically
        */
        AsyncJob job = this.asyncJobService.createJob();
        job.setFuture(this.monumentService.bulkCreateMonumentsAsync(bulkCreateSuggestion, job));

        return job;
    }

    /**
     * Reject a CreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion to reject
     * @return CreateMonumentSuggestion - CreateMonumentSuggestion object that was rejected
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/create/{id}/reject")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public CreateMonumentSuggestion rejectCreateSuggestion(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        CreateMonumentSuggestion createSuggestion = this.findCreateSuggestion(id);
        createSuggestion.setIsRejected(true);
        this.emailService.sendCreateSuggestionRejectionEmail(createSuggestion);
        return this.createSuggestionRepository.save(createSuggestion);
    }

    /**
     * Reject an UpdateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the UpdateMonumentSuggestion to reject
     * @return UpdateMonumentSuggestion - UpdateMonumentSuggestion object that was rejected
     * @throws ResourceNotFoundException - If an UpdateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/update/{id}/reject")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public UpdateMonumentSuggestion rejectUpdateSuggestion(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        UpdateMonumentSuggestion updateSuggestion = this.findUpdateSuggestion(id);
        updateSuggestion.setIsRejected(true);
        this.emailService.sendUpdateSuggestionRejectionEmail(updateSuggestion);
        return this.updateSuggestionRepository.save(updateSuggestion);
    }

    /**
     * Reject a BulkCreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the BulkCreateMonumentSuggestion to reject
     * @return BulkCreateMonumentSuggestion - BulkCreateMonumentSuggestion object that was rejected
     * @throws ResourceNotFoundException - If a BulkCreateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/bulk/{id}/reject")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public BulkCreateMonumentSuggestion rejectBulkCreateSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        BulkCreateMonumentSuggestion bulkCreateSuggestion = this.findBulkCreateSuggestion(id);

        bulkCreateSuggestion.setIsRejected(true);
        this.createSuggestionRepository.saveAll(bulkCreateSuggestion.getCreateSuggestions());
        bulkCreateSuggestion = this.bulkCreateSuggestionRepository.save(bulkCreateSuggestion);

        // Remove images from temporary S3 folder
        for (CreateMonumentSuggestion createSuggestion : bulkCreateSuggestion.getCreateSuggestions()) {
            if (createSuggestion.getImages() != null) {
                for (String imageUrl : createSuggestion.getImages()) {
                    this.awsS3Service.deleteObject(AwsS3Service.getObjectKey(imageUrl, true));
                }
            }
        }

        this.emailService.sendBulkCreateSuggestionRejectionEmail(bulkCreateSuggestion);

        return bulkCreateSuggestion;
    }

    /**
     * Helper function to find a CreateMonumentSuggestion object with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion object to find
     * @return CreateMonumentSuggestion - CreateMonumentSuggestion object with the specified ID, if it exists
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion does not exist with the specified ID
     */
    private CreateMonumentSuggestion findCreateSuggestion(Integer id) throws ResourceNotFoundException {
        Optional<CreateMonumentSuggestion> optional = this.createSuggestionRepository.findById(id);
        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("The requested Suggestion does not exist");
        }
        return optional.get();
    }

    /**
     * Helper function to find an UpdateMonumentSuggestion object with the specified ID, if it exists
     * @param id - ID of the UpdateMonumentSuggestion object to find
     * @return UpdateMonumentSuggestion - UpdateMonumentSuggestion object with the specified ID, if it exists
     * @throws ResourceNotFoundException - If an UpdateMonumentSuggestion does not exist with the specified ID
     */
    private UpdateMonumentSuggestion findUpdateSuggestion(Integer id) throws ResourceNotFoundException {
        Optional<UpdateMonumentSuggestion> optional = this.updateSuggestionRepository.findById(id);
        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("The requested Suggestion does not exist");
        }
        return optional.get();
    }

    /**
     * Helper function to find a BulkCreateMonumentSuggestion object with the specified ID, if it exists
     * @param id - ID of the BulkCreateMonumentSuggestion object to find
     * @return BulkCreateMonumentSuggestion - BulkCreateMonumentSuggestion object with the specified ID, if it exists
     * @throws ResourceNotFoundException - If a BulkCreateMonumentSuggestion does not exist with the specified ID
     */
    private BulkCreateMonumentSuggestion findBulkCreateSuggestion(Integer id) throws ResourceNotFoundException {
        Optional<BulkCreateMonumentSuggestion> optional = this.bulkCreateSuggestionRepository.findById(id);
        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("The requested Suggestion does not exist");
        }
        BulkCreateMonumentSuggestion bulkCreateSuggestion = optional.get();

        bulkCreateSuggestion.setCreateSuggestions(this.createSuggestionRepository.getAllByBulkCreateSuggestionId(bulkCreateSuggestion.getId()));
        return bulkCreateSuggestion;
    }
}
