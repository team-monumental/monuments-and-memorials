package com.monumental.controllers;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.Monument;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.security.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.util.Map;
import java.util.Optional;

@RestController
public class SuggestionController {

    @Autowired
    private CreateSuggestionRepository createSuggestionRepository;

    @PostMapping("/api/suggest/create")
    @PreAuthorize(Authentication.isAuthenticated)
    @Transactional
    public Map<String, Boolean> suggestMonumentCreation(@RequestBody CreateMonumentSuggestion createSuggestion) {
        this.createSuggestionRepository.save(createSuggestion);
        return Map.of("success", true);
    }

    @PostMapping("/api/suggest/create/approve/{id}")
    //@PreAuthorize(Authorization.)
    @Transactional
    public Monument approveCreateSuggestion(@PathVariable("id") Integer id) {
        Optional<CreateMonumentSuggestion> optional = this.createSuggestionRepository.findById(id);
        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("The requested Suggestion does not exist");
        }
    }
}
