package com.monumental.controllers;

import com.monumental.controllers.helpers.BulkCreateMonumentRequest;
import com.monumental.controllers.helpers.CreateMonumentRequest;
import com.monumental.controllers.helpers.MonumentAboutPageStatistics;
import com.monumental.controllers.helpers.UpdateMonumentRequest;
import com.monumental.exceptions.InvalidZipException;
import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.Monument;
import com.monumental.repositories.MonumentRepository;
import com.monumental.security.Authentication;
import com.monumental.security.Authorization;
import com.monumental.services.AsyncJobService;
import com.monumental.services.MonumentService;
import com.monumental.util.async.AsyncJob;
import com.monumental.util.csvparsing.MonumentBulkValidationResult;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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
     * Get a Monument with the specified ID, if it exists
     * @param id - ID of the Monument to get
     * @param cascade - If true, loads all of the lazy-loaded collections associated with the Monument
     * @return Monument - The Monument with the specified ID, if it exists
     * @throws ResourceNotFoundException - If a Monument with the specified ID does not exist
     */
    @GetMapping("/api/monument/{id}")
    public Monument getMonument(@PathVariable("id") Integer id,
                                @RequestParam(value = "cascade", defaultValue = "false") Boolean cascade)
            throws ResourceNotFoundException {
        Optional<Monument> optional = this.monumentRepository.findById(id);
        if (optional.isEmpty()) throw new ResourceNotFoundException("The requested Monument or Memorial does not exist");
        Monument monument = optional.get();

        if (cascade) {
            this.monumentService.initializeAllLazyLoadedCollections(monument);
        }
        return monument;
    }

    /**
     * Get all of the Monuments
     * @return List<Monument> - List of all of the Monuments
     */
    @GetMapping("/api/monuments")
    public List<Monument> getAllMonuments() {
        return this.monumentRepository.findAll();
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
