package com.monumental.repositories.suggestions;

import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BulkCreateSuggestionRepository extends JpaRepository<BulkCreateMonumentSuggestion, Integer> {

}
