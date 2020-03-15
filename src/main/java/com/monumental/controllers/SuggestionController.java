package com.monumental.controllers;

import com.monumental.controllers.helpers.BulkCreateMonumentRequest;
import com.monumental.exceptions.InvalidZipException;
import com.monumental.exceptions.ResourceNotFoundException;
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
import com.monumental.services.AsyncJobService;
import com.monumental.services.MonumentService;
import com.monumental.util.async.AsyncJob;
import com.monumental.util.csvparsing.MonumentBulkValidationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
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

    /**
     * Create a new Suggestion for creating a Monument
     * @param createSuggestion - CreateMonumentSuggestion object representing the new Monument suggestion
     * @return Map<String, Boolean> - Map of result String to actual result
     */
    @PostMapping("/api/suggestion/create")
    @PreAuthorize(Authentication.isAuthenticated)
    @Transactional
    public Map<String, Boolean> suggestMonumentCreation(@RequestBody CreateMonumentSuggestion createSuggestion) {
        this.createSuggestionRepository.save(createSuggestion);
        return Map.of("success", true);
    }

    /**
     * Create a new Suggestion for updating a Monument, if it exists
     * @param monumentId - Integer ID of the Monument to suggest the update for
     * @param updateSuggestion - UpdateMonumentSuggestion object representing the updated Monument
     * @return Map<String, Boolean> - Map of result String to actual result
     * @throws ResourceNotFoundException - If a Monument with the specified monumentId does not exist
     */
    @PostMapping("/api/suggestion/update")
    @PreAuthorize(Authentication.isAuthenticated)
    @Transactional
    public Map<String, Boolean> suggestMonumentUpdate(@RequestParam Integer monumentId,
                                                      @RequestBody UpdateMonumentSuggestion updateSuggestion) {
        Optional<Monument> optional = this.monumentRepository.findById(monumentId);
        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("The requested Monument or Memorial does not exist");
        }
        Monument monument = optional.get();

        updateSuggestion.setMonument(monument);
        this.updateSuggestionRepository.save(updateSuggestion);

        return Map.of("success", true);
    }

    /**
     * Determine which rows in the specified .csv (or .csv within .zip) file are valid
     * @param request - BulkCreateMonumentRequest object containing the field mapping and the file to process
     * @return BulkCreateResult - Object representing the results of the Bulk Monument Validate operation
     */
    @PostMapping("/api/suggestion/bulk-create/validate")
    @PreAuthorize(Authentication.isAuthenticated)
    public MonumentBulkValidationResult validateMonumentCSV(@ModelAttribute BulkCreateMonumentRequest request) {
        try {
            BulkCreateMonumentRequest.ParseResult parseResult = request.parse(this.monumentService);
            return this.monumentService.validateMonumentCSV(parseResult.csvContents, parseResult.mapping, parseResult.zipFile);
        } catch (InvalidZipException | IOException e) {
            MonumentBulkValidationResult result = new MonumentBulkValidationResult();
            result.setError(e.getMessage());
            return result;
        }
    }

    /**
     * Create a new Suggestion for bulk-creating Monuments
     * @param request - BulkCreateMonumentRequest object containing the field mapping and the file to process
     * @return BulkCreateMonumentSuggestion - The newly created BulkCreateMonumentSuggestion object
     * @throws IOException - If an exception occurs during parsing of the .csv and/or .zip file
     */
    @PostMapping("/api/suggestion/bulk-create")
    @PreAuthorize(Authentication.isAuthenticated)
    @Transactional
    public BulkCreateMonumentSuggestion suggestBulkMonumentCreation(@ModelAttribute BulkCreateMonumentRequest request)
            throws IOException {
        BulkCreateMonumentRequest.ParseResult parseResult = request.parse(this.monumentService);
        MonumentBulkValidationResult validationResult = this.monumentService.validateMonumentCSV(parseResult.csvContents,
                parseResult.mapping, parseResult.zipFile);
        return this.monumentService.parseMonumentBulkValidationResult(validationResult);
    }

    /**
     * Get a CreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion to get
     * @return CreateMonumentSuggestion - CreateMonumentSuggestion object with the specified ID, if it exists
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @GetMapping("/api/suggestion/create/{id}")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    @Transactional
    public CreateMonumentSuggestion getCreateMonumentSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        return this.findCreateSuggestion(id);
    }

    /**
     * Get an UpdateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the UpdateMonumentSuggestion to get
     * @return UpdateMonumentSuggestion - UpdateMonumentSuggestion object with the specified ID, if it exists
     * @throws ResourceNotFoundException - If an UpdateMonumentSuggestion with the specified ID does not exist
     */
    @GetMapping("/api/suggestion/update/{id}")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    @Transactional
    public UpdateMonumentSuggestion getUpdateMonumentSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        return this.findUpdateSuggestion(id);
    }

    /**
     * Get a BulkCreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the BulkCreateMonumentSuggestion to get
     * @return BulkCreateMonumentSuggestion - BulkCreateMonumentSuggestion object with the specified ID, if it exists
     * @throws ResourceNotFoundException - If a BulkCreateMonumentSuggestion with the specified ID does not exist
     */
    @GetMapping("/api/suggestion/bulk-create/{id}")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    @Transactional
    public BulkCreateMonumentSuggestion getBulkCreateMonumentSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        return this.findBulkCreateSuggestion(id);
    }

    /**
     * Approve a CreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion to approve
     * @return Monument - The newly created Monument based on the attributes of the CreateMonumentSuggestion with the
     *                  specified ID
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/create/{id}/approve")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    @Transactional
    public Monument approveCreateSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        CreateMonumentSuggestion createSuggestion = this.findCreateSuggestion(id);

        createSuggestion.setIsApproved(true);
        createSuggestion = this.createSuggestionRepository.save(createSuggestion);

        return this.monumentService.createMonument(createSuggestion);
    }

    /**
     * Approve an UpdateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the UpdateMonumentSuggestion to approve
     * @return Monument - The updated Monument
     * @throws ResourceNotFoundException - If an UpdateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/update/{id}/approve")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    @Transactional
    public Monument approveUpdateSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        UpdateMonumentSuggestion updateSuggestion = this.findUpdateSuggestion(id);

        updateSuggestion.setIsApproved(true);
        updateSuggestion = this.updateSuggestionRepository.save(updateSuggestion);

        return this.monumentService.updateMonument(updateSuggestion);
    }

    /**
     * Approve a BulkCreateMonumentSuggestion with the specified ID, if it exists
     * Starts the job to create Monuments asynchronously
     * @param id - ID of the BulkCreateMonumentSuggestion to approve
     * @return AsyncJob - Object containing the ID of the job created and the current value of the Future object
     * @throws ResourceNotFoundException - If a BulkCreateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/bulk-create/{id}/approve")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    @Transactional
    public AsyncJob approveBulkCreateSuggestion(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        BulkCreateMonumentSuggestion bulkCreateSuggestion = this.findBulkCreateSuggestion(id);

        bulkCreateSuggestion.setIsApproved(true);
        bulkCreateSuggestion = this.bulkCreateSuggestionRepository.save(bulkCreateSuggestion);

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
     * @return Map<String, Boolean> - Map of result String to actual result
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/create/{id}/reject")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    @Transactional
    public Map<String, Boolean> rejectCreateSuggestion(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        CreateMonumentSuggestion createSuggestion = this.findCreateSuggestion(id);

        createSuggestion.setIsRejected(true);
        this.createSuggestionRepository.save(createSuggestion);

        return Map.of("success", true);
    }

    /**
     * Reject an UpdateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the UpdateMonumentSuggestion to reject
     * @return Map<String, Boolean> - Map of result String to actual result
     * @throws ResourceNotFoundException - If an UpdateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/update/{id}/reject")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    @Transactional
    public Map<String, Boolean> rejectUpdateSuggestion(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        UpdateMonumentSuggestion updateSuggestion = this.findUpdateSuggestion(id);

        updateSuggestion.setIsRejected(true);
        this.updateSuggestionRepository.save(updateSuggestion);

        return Map.of("success", true);
    }

    /**
     * Reject a BulkCreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the BulkCreateMonumentSuggestion to reject
     * @return Map<String, Boolean> - Map of result String to actual result
     * @throws ResourceNotFoundException - If a BulkCreateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/bulk-create/{id}/reject")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    @Transactional
    public Map<String, Boolean> rejectBulkCreateSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        BulkCreateMonumentSuggestion bulkCreateSuggestion = this.findBulkCreateSuggestion(id);

        bulkCreateSuggestion.setIsRejected(true);
        this.bulkCreateSuggestionRepository.save(bulkCreateSuggestion);

        return Map.of("success", true);
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
        return optional.get();
    }
}
