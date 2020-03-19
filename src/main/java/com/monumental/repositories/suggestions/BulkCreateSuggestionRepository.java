package com.monumental.repositories.suggestions;

import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface BulkCreateSuggestionRepository extends JpaRepository<BulkCreateMonumentSuggestion, Integer> {

}
