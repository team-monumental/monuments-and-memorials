package com.monumental.repositories.suggestions;

import com.monumental.models.suggestions.CreateMonumentSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreateSuggestionRepository extends JpaRepository<CreateMonumentSuggestion, Integer> {

}
