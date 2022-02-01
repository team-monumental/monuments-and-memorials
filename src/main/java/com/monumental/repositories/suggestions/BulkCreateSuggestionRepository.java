package com.monumental.repositories.suggestions;

import com.monumental.models.User;
import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface BulkCreateSuggestionRepository extends JpaRepository<BulkCreateMonumentSuggestion, Integer> {

    /**
     * Get all BulkCreateMonumentSuggestions created by the specified createdBy
     *
     * @param createdBy - User object to get all of the BulkCreateMonumentSuggestions that were created by it
     * @return List<BulkCreateMonumentSuggestions> - List of BulkCreateMonumentSuggestions created by the specified
     * createdBy
     */
    List<BulkCreateMonumentSuggestion> getAllByCreatedBy(User createdBy);
}
