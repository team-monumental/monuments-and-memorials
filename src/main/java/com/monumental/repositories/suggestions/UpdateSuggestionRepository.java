package com.monumental.repositories.suggestions;

import com.monumental.models.User;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface UpdateSuggestionRepository extends JpaRepository<UpdateMonumentSuggestion, Integer> {

    /**
     * Get all UpdateMonumentSuggestions associated with the specified BulkUpdateMonumentSuggestion ID
     * @param id - ID of the BulkUpdateMonumentSuggestion to get the UpdateMonumentSuggestion for
     */
    @Query("select ums from UpdateMonumentSuggestion ums where bulk_update_suggestion_id = :id")
    List<UpdateMonumentSuggestion> getAllByBulkUpdateSuggestionId(@Param("id") Integer id);

    /**
     * Get all UpdateMonumentSuggestions created by the specified createdBy tht are not part of a
     * BulkUpdateMonumentSuggestion
     * @param createdBy - User object to get all of the UpdateMonumentSuggestions that were created by it
     * @return List<UpdateMonumentSuggestion> - List of UpdateMonumentSuggestions created by the specified createdBy
     * that are not part of a BulkUpdateMonumentSuggestion
     */
    List<UpdateMonumentSuggestion> getAllByCreatedByAndBulkUpdateSuggestionIsNull(User createdBy);

    void deleteAllByMonumentId(Integer monumentId);
}
