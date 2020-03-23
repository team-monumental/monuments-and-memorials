package com.monumental.services.suggestions;

import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.services.ModelService;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class CreateSuggestionService extends ModelService<CreateMonumentSuggestion> {

    @Autowired
    private UserService userService;

    @Autowired
    private CreateSuggestionRepository createSuggestionRepository;

    /**
     * Get all CreateMonumentSuggestions created by the currently logged in User that are not part of a
     * BulkCreateMonumentSuggestion
     * @return List<CreateMonumentSuggestion> - List of CreateMonumentSuggestions created by the currently logged in
     * User that are not part of a BulkCreateMonumentSuggestion
     * @throws UnauthorizedException - If no User is currently logged in
     */
    public List<CreateMonumentSuggestion> getCreateMonumentSuggestions() throws UnauthorizedException {
        User currentUser = this.userService.getCurrentUser();
        return this.createSuggestionRepository.getAllByCreatedByAndBulkCreateSuggestionIsNull(currentUser);
    }
}
