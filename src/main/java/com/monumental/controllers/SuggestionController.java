package com.monumental.controllers;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.security.Authentication;
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
     * Approve a CreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion to approve
     * @return Map<String, Boolean> - Map of result String to actual result
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @PostMapping("/api/suggestion/create/{id}/approve")
    // TODO
    //@PreAuthorize(Authorization.)
    @Transactional
    public Map<String, Boolean> approveCreateSuggestion(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        CreateMonumentSuggestion createSuggestion = this.findCreateSuggestion(id);

        createSuggestion.setIsApproved(true);
        this.createSuggestionRepository.save(createSuggestion);

        return Map.of("success", true);
    }

    /**
     * Reject a CreateMonumentSuggestion with the specified ID, if it exists
     * @param id - ID of the CreateMonumentSuggestion to reject
     * @return Map<String, Boolean> - Map of result String to actual result
     * @throws ResourceNotFoundException - If a CreateMonumentSuggestion with the specified ID does not exist
     */
    @PostMapping("/api/suggestion/create/{id}/reject")
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
}
