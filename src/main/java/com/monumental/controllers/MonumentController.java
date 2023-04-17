package com.monumental.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.monumental.controllers.helpers.MonumentAboutPageStatistics;
import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.repositories.suggestions.UpdateSuggestionRepository;
import com.monumental.security.Authorization;
import com.monumental.security.Role;
import com.monumental.services.MonumentService;
import com.monumental.services.UserService;
import com.rollbar.notifier.Rollbar;
import org.hibernate.Hibernate;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
public class MonumentController {

    @Autowired
    private MonumentRepository monumentRepository;

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private UserService userService;

    @Autowired
    private CreateSuggestionRepository createSuggestionRepository;

    @Autowired
    private UpdateSuggestionRepository updateSuggestionRepository;

    @Autowired
    private Rollbar rollbar;

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

        // this requires committing to a rollbar paid plan because it will greatly increase out event volume.
        // rollbar.info("Retrieved monument!");

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
    public List<Monument> getAllMonuments(@RequestParam(defaultValue = "true") Boolean onlyActive,
                                      @RequestParam(value = "cascade", defaultValue = "false") Boolean cascade
    ) throws UnauthorizedException {
        List<Monument> monuments;
        if (onlyActive) {
            monuments = this.monumentRepository.findAllByIsActive(true);
        } else {
            this.userService.requireUserIsInRoles(Role.PARTNER_OR_ABOVE);
            monuments = this.monumentRepository.findAll();
        }

        if (cascade) {
            monuments.forEach(monument -> this.monumentService.initializeAllLazyLoadedCollections(monument));
        }

        return monuments;
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
        Monument updatedMonument = this.monumentRepository.save(monument);
        if (request.isActive) {
            rollbar.info("Activated monument" + updatedMonument.getId() + "!");
        } else {
            rollbar.info("Deactivated monument" + updatedMonument.getId() + "!");
        }
        return updatedMonument;
    }

    /**
     * Permanently delete a Monument with the specified ID
     * @param id - ID of the Monument to delete
     */
    @DeleteMapping("/api/monument/{id}")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Map<String, Boolean> deleteMonument(@PathVariable("id") Integer id) throws UnauthorizedException {
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
     * Get the statistics related to Monuments for the About Page
     * @return MonumentAboutPageStatistics - Object containing the various statistics relating to Monuments for the
     * About Page
     */
    @GetMapping("/api/monument/statistics")
    public MonumentAboutPageStatistics getMonumentAboutPageStatistics() {
        return this.monumentService.getMonumentAboutPageStatistics(true);
    }

    /**
     * Create a Monument using the specified createSuggestion
     * @param createSuggestion - CreateMonumentSuggestion to use to create the new Monument
     * @return Monument - The created Monument based on the specified createSuggestion
     */
    @PostMapping("/api/monument/create")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Monument createMonument(@RequestBody CreateMonumentSuggestion createSuggestion) {
        createSuggestion.setIsApproved(true);
        createSuggestion = this.createSuggestionRepository.save(createSuggestion);
        return this.monumentService.createMonument(createSuggestion);
    }

    @PostMapping("/api/monument/create/testing")
    public boolean uploadImages(@RequestParam("files") MultipartFile[] multipartFiles) {
        for (MultipartFile multipartFile : multipartFiles) {
//            Buff
        }

        return true;
    }

    /**
     * Update the Monument with the specified monumentId to have the new attributes defined by the specified
     * updateSuggestion
     * @param monumentId - Integer ID of the Monument to update
     * @param updateSuggestion - UpdateMonumentSuggestion defining the new attributes for the Monument
     * @return Monument - The updated Monument with the specified monumentId based on the attributes defined in the
     * specified updateSuggestion
     * @throws ResourceNotFoundException - If a Monument with the specified monumentId does not exist
     */
    @PutMapping("/api/monument/update/{id}")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Monument updateMonument(@PathVariable("id") Integer monumentId,
                                   @RequestBody UpdateMonumentSuggestion updateSuggestion)
            throws ResourceNotFoundException {
        Optional<Monument> optional = this.monumentRepository.findById(monumentId);
        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("The requested Monument or Memorial does not exist");
        }
        Monument monument = optional.get();

        updateSuggestion.setMonument(monument);
        updateSuggestion.setIsApproved(true);
        updateSuggestion = this.updateSuggestionRepository.save(updateSuggestion);
        return this.monumentService.updateMonument(updateSuggestion);
    }

    /**
     * Overwrites the Monument with the specified monumentId with the provided Monument. Provides functionality
     * for BulkEdit to bypass processing updates as update suggestions
     *
     * @param monumentId - Integer ID of the Monument to replace
     * @return Monument - The updated Monument with the specified monumentId based on the attributes defined in the
     * specified Monument
     * @throws ResourceNotFoundException - If a Monument with the specified monumentId does not exist
     */
    @PutMapping("/api/monument/bulkupdate/{id}")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Monument bulkUpdateMonument(@PathVariable("id") Integer monumentId, @RequestParam(required = false) String newTagString,
                                       @RequestParam(required = false) String newReferencesString,
                                       @RequestParam(required = false) String deletedReferenceString,
                                       @RequestParam(required = false) Double lat,
                                       @RequestParam(required = false) Double lon,
                                       @RequestBody Monument monument)
            throws ResourceNotFoundException, IOException {

        Optional<Monument> optionalMonument = this.monumentRepository.findById(monumentId);
        if (optionalMonument.isEmpty()) {
            throw new ResourceNotFoundException("The requested Monument or Memorial does not exist");
        }

        String result = java.net.URLDecoder.decode(newTagString, StandardCharsets.UTF_8);
        String references = java.net.URLDecoder.decode(newReferencesString, StandardCharsets.UTF_8);
        String deletedReferences = java.net.URLDecoder.decode(deletedReferenceString, StandardCharsets.UTF_8);
        ObjectMapper mapper = new ObjectMapper();
        List<String> strings = mapper.readValue(result, List.class);

        List<Integer> deletedRefs = mapper.readValue(deletedReferences, List.class);
        Map<String, String> referenceList = mapper.readValue(references, Map.class);
        Point point = MonumentService.createMonumentPoint(lon, lat);
        monument.setCoordinates(point);
        this.monumentRepository.saveAndFlush(monument);
        this.monumentService.updateMonumentTags(monument, strings, false);

        Map<Integer, String> newRefs = new HashMap<>();
        for (String i : referenceList.keySet()) {
            if (Integer.parseInt(i) < 0) {
                this.monumentService.createMonumentReferences(referenceList.get(i), monument);
                referenceList.remove(i);
                continue;
            }
            newRefs.put(Integer.parseInt(i), referenceList.get(i));
        }
        this.monumentService.updateMonumentReferences(monument, newRefs);
        this.monumentService.deleteMonumentReferences(monument, deletedRefs);
        return monument;
    }
}
