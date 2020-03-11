package com.monumental.controllers;

import com.monumental.controllers.helpers.BulkCreateMonumentRequest;
import com.monumental.controllers.helpers.CreateMonumentRequest;
import com.monumental.controllers.helpers.MonumentAboutPageStatistics;
import com.monumental.controllers.helpers.UpdateMonumentRequest;
import com.monumental.exceptions.InvalidZipException;
import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.Monument;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.MonumentTagRepository;
import com.monumental.security.Authentication;
import com.monumental.security.Authorization;
import com.monumental.security.Role;
import com.monumental.services.AsyncJobService;
import com.monumental.services.MonumentService;
import com.monumental.services.UserService;
import com.monumental.util.async.AsyncJob;
import com.monumental.util.csvparsing.MonumentBulkValidationResult;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@RestController
public class MonumentController {

    @Autowired
    private MonumentRepository monumentRepository;

    @Autowired
    private AsyncJobService asyncJobService;

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private UserService userService;

    /**
     * Create a new Monument based on the specified CreateMonumentRequest
     * @param monumentRequest - CreateMonumentRequest containing the attributes to use to create the Monument
     * @return Monument - The created Monument
     */
    @PostMapping("/api/monument")
    @PreAuthorize(Authentication.isAuthenticated)
    @Transactional
    public Monument createMonument(@RequestBody CreateMonumentRequest monumentRequest) {
        return this.monumentService.createMonument(monumentRequest);
    }

    /**
     * Get a Monument with the specified ID, if it exists and is active or inactive depending on onlyActive
     * @param id - ID of the Monument to get
     * @param cascade - If true, loads all of the lazy-loaded collections associated with the Monument
     * @param onlyActive - If true, a 404 will be returned if the specified Monument is inactive. If false, the monument
     *                 will be returned regardless of whether it's active or inactive.
     *                 If this is false then the user must be a partner or above to view
     * @return Monument - The Monument with the specified ID, if it exists
     * @throws ResourceNotFoundException - If a Monument with the specified ID does not exist or onlyActive is true and isActive is false
     * @throws AccessDeniedException - If trying to get an inactive monument without being a partner or above
     * @throws UnauthorizedException - If trying to get an inactive monument and not logged in
     */
    @GetMapping("/api/monument/{id}")
    public Monument getMonument(@PathVariable("id") Integer id,
                                      @RequestParam(value = "cascade", defaultValue = "false") Boolean cascade,
                                      @RequestParam(defaultValue = "true") Boolean onlyActive)
            throws ResourceNotFoundException, AccessDeniedException, UnauthorizedException {
        Optional<Monument> optional;
        try {
            if (onlyActive) {
                optional = this.monumentRepository.findByIdAndIsActive(id, true);
            } else {
                this.userService.requireUserIsInRoles(Role.PARTNER_OR_ABOVE);
                optional = this.monumentRepository.findById(id);
            }
        } catch (EntityNotFoundException e) {
            optional = Optional.empty();
        }
        if (optional.isEmpty()) throw new ResourceNotFoundException("The requested Monument or Memorial does not exist");
        Monument monument = optional.get();

        if (cascade) {
            this.monumentService.initializeAllLazyLoadedCollections(monument);
        }
        return monument;
    }

    /**
     * Get all of the Monuments and is active or inactive depending on onlyActive
     * @param onlyActive - If true, only active monuments will be returned. If false, monuments
     *                 will be returned regardless of whether they're active or inactive.
     *                 If this is false then the user must be a partner or above to view
     * @return List<Monument> - List of all of the Monuments
     * @throws AccessDeniedException - If trying to get inactive monuments without being a partner or above
     * @throws UnauthorizedException - If trying to get inactive monuments and not logged in
     */
    @GetMapping("/api/monuments")
    public List<Monument> getAllMonuments(@RequestParam(defaultValue = "true") Boolean onlyActive) throws UnauthorizedException {
        if (onlyActive) {
            return this.monumentRepository.findAllByIsActive(true);
        } else {
            this.userService.requireUserIsInRoles(Role.PARTNER_OR_ABOVE);
            return this.monumentRepository.findAll();
        }
    }

    /**
     * Update an existing Monument with the specified ID to have the specified attributes
     * @param id - ID of the Monument to update
     * @param newMonument - UpdateMonumentRequest containing the new attributes for the Monument
     * @return Monument - The updated Monument
     */
    @PutMapping("/api/monument/{id}")
    @PreAuthorize(Authentication.isAuthenticated)
    public Monument updateMonument(@PathVariable("id") Integer id, @RequestBody UpdateMonumentRequest newMonument) {
        return this.monumentService.updateMonument(id, newMonument);
    }

    private static class ToggleIsActiveRequest {
        public boolean isActive;
    }

    /**
     * Change the value of isActive on a Monument
     * @param id - ID of the Monument to update
     * @param request - ToggleIsActiveRequest containing the new value for isActive
     * @return Monument - The updated Monument
     */
    @PutMapping("/api/monument/active/{id}")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Monument updateMonumentIsActive(@PathVariable("id") Integer id, @RequestBody ToggleIsActiveRequest request) {
        Monument monument = this.monumentRepository.getOne(id);
        monument.setIsActive(request.isActive);
        return this.monumentRepository.save(monument);
    }

    /**
     * Permanently delete a Monument with the specified ID
     * @param id - ID of the Monument to delete
     */
    @DeleteMapping("/api/monument/{id}")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Map<String, Boolean> deleteMonument(@PathVariable("id") Integer id) {
        this.monumentService.deleteMonument(id);
        return Map.of("success", true);
    }

    @GetMapping("/api/monuments/related")
    public List<Monument> getRelatedMonumentsByTags(@RequestParam List<String> tags,
                                                    @RequestParam Integer monumentId,
                                                    @RequestParam(required = false, defaultValue = "10") Integer limit) {
        List<Monument> monuments = this.monumentService.getRelatedMonumentsByTags(tags, monumentId, limit);
        for (Monument monument : monuments) {
            Hibernate.initialize(monument.getImages());
            Hibernate.initialize(monument.getMonumentTags());
        }
        return monuments;
    }

    /**
     * Validate which rows in the specified .csv (or .csv within .zip) file are valid
     * @param request - Contains the field mapping and the file to process
     * @return BulkCreateResult - Object representing the results of the Bulk Monument Validate operation
     */
    @PostMapping("/api/monument/bulk/validate")
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
     * Start the job to create monuments from csv or zip
     * @param request - Contains the field mapping and the file to process
     * @return AsyncJob - Object containing the Id of the job created and the current value of the Future object
     */
    @PostMapping("/api/monument/bulk/create/start")
    @PreAuthorize(Authentication.isAuthenticated)
    public AsyncJob startBulkCreateMonumentJob(@ModelAttribute BulkCreateMonumentRequest request) throws IOException {
        BulkCreateMonumentRequest.ParseResult parseResult = request.parse(this.monumentService);

        MonumentBulkValidationResult validationResult = this.monumentService.validateMonumentCSV(
                parseResult.csvContents, parseResult.mapping, parseResult.zipFile
        );

        /* TODO: This is not a particularly easy way of creating AsyncJobs, I can't think of a way to abstract
         * it away currently because the AsyncJob must be passed to the CompletableFuture method, and the CompletableFuture
         * must be passed to the AsyncJob, making it difficult to do so dynamically
         */
        AsyncJob job = this.asyncJobService.createJob();
        job.setFuture(this.monumentService.bulkCreateMonumentsAsync(
                new ArrayList<>(validationResult.getValidResults().values()),
                job
        ));
        return job;
    }

    /**
     * Check the progress of a create bulk monuments job
     * @param id - Id of the job to check
     * @return AsyncJob - Object containing the Id of the job and the current value of the Future object
     */
    @GetMapping("/api/monument/bulk/create/progress/{id}")
    @PreAuthorize(Authentication.isAuthenticated)
    public AsyncJob getBulkCreateMonumentJob(@PathVariable Integer id) {
        return this.asyncJobService.getJob(id);
    }

    /**
     * Get the final result of a create bulk monuments job. If the job is not completed yet this will wait for it to
     * complete, so be sure to call getBulkCreateMonumentJob and check the status before calling this
     * @param id - Id of the job to get the result of
     * @return List<Monument> - The monuments created
     * @throws ExecutionException - Can be thrown by Java if the future encountered an exception
     * @throws InterruptedException - Can be thrown by Java if the future encountered an exception
     */
    @GetMapping("/api/monument/bulk/create/result/{id}")
    @PreAuthorize(Authentication.isAuthenticated)
    @SuppressWarnings("unchecked")
    public List<Monument> getBulkCreateMonumentJobResult(@PathVariable Integer id)
            throws ExecutionException, InterruptedException {
        return (List<Monument>) this.asyncJobService.getJob(id).getFuture().get();
    }

    /**
     * Get the statistics related to Monuments for the About Page
     * @return MonumentAboutPageStatistics - Object containing the various statistics relating to Monuments for the
     * About Page
     */
    @GetMapping("/api/monument/statistics")
    public MonumentAboutPageStatistics getMonumentAboutPageStatistics() {
        return this.monumentService.getMonumentAboutPageStatistics();
    }
}
