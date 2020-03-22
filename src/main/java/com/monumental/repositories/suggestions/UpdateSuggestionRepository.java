package com.monumental.repositories.suggestions;

import com.monumental.models.User;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface UpdateSuggestionRepository extends JpaRepository<UpdateMonumentSuggestion, Integer> {

    /**
     * Get all UpdateMonumentSuggestions created by the specified createdBy
     * @param createdBy - User object to get all of the UpdateMonumentSuggestions that were created by it
     * @return List<UpdateMonumentSuggestion> - List of UpdateMonumentSuggestions created by the specified createdBy
     */
    List<UpdateMonumentSuggestion> getAllByCreatedBy(User createdBy);
}
