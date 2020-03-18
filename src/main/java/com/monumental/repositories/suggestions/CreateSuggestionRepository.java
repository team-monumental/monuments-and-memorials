package com.monumental.repositories.suggestions;

import com.monumental.models.suggestions.CreateMonumentSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CreateSuggestionRepository extends JpaRepository<CreateMonumentSuggestion, Integer> {

    /**
     * Get all CreateMonumentSuggestions associated with the specified BulkCreateMonumentSuggestion ID
     * @param id - ID of the BulkCreateMonumentSuggestion to get the CreateMonumentSuggestions for
     */
    @Query("select cms from CreateMonumentSuggestion cms where bulk_create_suggestion_id = :id")
    List<CreateMonumentSuggestion> getAllByBulkCreateSuggestionId(@Param("id") Integer id);
}
