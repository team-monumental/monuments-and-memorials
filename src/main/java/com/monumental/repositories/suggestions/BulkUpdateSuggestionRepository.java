package com.monumental.repositories.suggestions;

import com.monumental.models.User;
import com.monumental.models.suggestions.BulkUpdateMonumentSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface BulkUpdateSuggestionRepository extends JpaRepository<BulkUpdateMonumentSuggestion, Integer>{

    /**
     * Get all BulkUpdateMonumentSuggestions created by the specified updatedBy
     * @param createdBy - User object to get all of the BulkUpdateMonumentSuggestions that were created by it
     * @return List<BulkUpdateMonumentSuggestions> - List of BulkUpdateMonumentSuggestions created by the specified
     * updatedBy
     */
    List<BulkUpdateMonumentSuggestion> getAllByCreatedBy(User createdBy);
}
