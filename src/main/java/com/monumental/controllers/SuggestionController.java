package com.monumental.controllers;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.Monument;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.repositories.suggestions.UpdateSuggestionRepository;
import com.monumental.security.Authentication;
import com.monumental.services.MonumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
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

    /**
     * Create a new Suggestion for creating a Monument
     * @param createSuggestion - CreateMonumentSuggestion object representing the new Monument to suggest
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
     * @param updateSuggestion - UpdateMonumentSuggestion object representing the suggested updates
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
     * Get a CreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion to get
     * @return CreateMonumentSuggestion - CreateMonumentSuggestion object with the specified ID, if it exists
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @GetMapping("/api/suggestion/create/{id}")
    // TODO
    //@PreAuthorize()
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
    // TODO
    //@PreAuthorize()
    @Transactional
    public UpdateMonumentSuggestion getUpdateMonumentSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        return this.findUpdateSuggestion(id);
    }

    /**
     * Approve a CreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion to approve
     * @return Monument - The newly created Monument based on the attributes of the CreateMonumentSuggestion with the
     *                  specified ID
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/create/{id}/approve")
    // TODO
    //@PreAuthorize(Authorization.)
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
    // TODO
    //@PreAuthorize(Authorization.)
    @Transactional
    public Monument approveUpdateSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        UpdateMonumentSuggestion updateSuggestion = this.findUpdateSuggestion(id);

        updateSuggestion.setIsApproved(true);
        updateSuggestion = this.updateSuggestionRepository.save(updateSuggestion);

        return this.monumentService.updateMonument(updateSuggestion);
    }

    /**
     * Reject a CreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion to reject
     * @return Map<String, Boolean> - Map of result String to actual result
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @PutMapping("/api/suggestion/create/{id}/reject")
    // TODO
    //@PreAuthorize()
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
    // TODO
    //@PreAuthorize()
    @Transactional
    public Map<String, Boolean> rejectUpdateSuggestion(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        UpdateMonumentSuggestion updateSuggestion = this.findUpdateSuggestion(id);

        updateSuggestion.setIsRejected(true);
        this.updateSuggestionRepository.save(updateSuggestion);

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
}
