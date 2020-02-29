package com.monumental.repositories.suggestions;

import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UpdateSuggestionRepository extends JpaRepository<UpdateMonumentSuggestion, Integer> {

}
