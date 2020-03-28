package com.monumental.services.suggestions;

import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import com.monumental.repositories.suggestions.BulkCreateSuggestionRepository;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.services.ModelService;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class BulkCreateSuggestionService extends ModelService<BulkCreateMonumentSuggestion> {

    @Autowired
    private UserService userService;

    @Autowired
    private BulkCreateSuggestionRepository bulkCreateSuggestionRepository;

    @Autowired
    private CreateSuggestionRepository createSuggestionRepository;

    /**
     * Get all BulkCreateMonumentSuggestions created by the currently logged in User
     * Also loads the corresponding CreateMonumentSuggestions onto each BulkCreateMonumentSuggestion
     * @return List<BulkCreateMonumentSuggestion> - List of BulkCreateMonumentSuggestions created by the currently
     * logged in User
     * @throws UnauthorizedException - If no User is currently logged in
     */
    public List<BulkCreateMonumentSuggestion> getBulkCreateMonumentSuggestions() throws UnauthorizedException {
        User currentUser = this.userService.getCurrentUser();
        List<BulkCreateMonumentSuggestion> bulkCreateSuggestions = this.bulkCreateSuggestionRepository.getAllByCreatedBy(currentUser);

        for (BulkCreateMonumentSuggestion bulkCreateSuggestion : bulkCreateSuggestions) {
            bulkCreateSuggestion.setCreateSuggestions(this.createSuggestionRepository.getAllByBulkCreateSuggestionId(bulkCreateSuggestion.getId()));
        }

        return this.bulkCreateSuggestionRepository.getAllByCreatedBy(currentUser);
    }
}
