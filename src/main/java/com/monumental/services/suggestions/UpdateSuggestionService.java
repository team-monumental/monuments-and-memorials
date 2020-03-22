package com.monumental.services.suggestions;

import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import com.monumental.repositories.suggestions.UpdateSuggestionRepository;
import com.monumental.services.ModelService;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class UpdateSuggestionService extends ModelService<UpdateMonumentSuggestion> {

    @Autowired
    private UserService userService;

    @Autowired
    private UpdateSuggestionRepository updateSuggestionRepository;

    /**
     * Get all UpdateMonumentSuggestions created by the currently logged in User
     * @return List<UpdateMonumentSuggestion> - List of UpdateMonumentSuggestions created by the currently logged in
     * User
     * @throws UnauthorizedException - If no User is currently logged in
     */
    public List<UpdateMonumentSuggestion> getUpdateMonumentSuggestions() throws UnauthorizedException {
        User currentUser = this.userService.getCurrentUser();
        return this.updateSuggestionRepository.getAllByCreatedBy(currentUser);
    }
}
