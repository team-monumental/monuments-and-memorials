package com.monumental.services.suggestions;

import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.models.suggestions.BulkUpdateMonumentSuggestion;
import com.monumental.repositories.suggestions.BulkUpdateSuggestionRepository;
import com.monumental.repositories.suggestions.UpdateSuggestionRepository;
import com.monumental.services.ModelService;
import com.monumental.services.UserService;
import com.monumental.util.search.SearchHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.util.List;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

@Service
@Transactional
public class BulkUpdateSuggestionService extends ModelService<BulkUpdateMonumentSuggestion> {

    @Autowired
    private UserService userService;

    @Autowired
    private BulkUpdateSuggestionRepository bulkUpdateSuggestionRepository;

    @Autowired
    private UpdateSuggestionRepository updateSuggestionRepository;

    /**
     * Get all BulkUpdateMonumentSuggestions created by the currently logged in User
     * Also loads the corresponding UpdateMonumentSuggestions onto each BulkUpdateMonumentSuggestion
     * @return List<BulkUpdateMonumentSuggestion> - List of BulkUpdateMonumentSuggestions created by the currently
     * logged in User
     * @throws UnauthorizedException - If no User is currently logged in
     */
    public List<BulkUpdateMonumentSuggestion> getBulkUpdateMonumentSuggestion() throws UnauthorizedException{
        User currentUser = this.userService.getCurrentUser();
        List<BulkUpdateMonumentSuggestion> bulkUpdateSuggestions = this.bulkUpdateSuggestionRepository.getAllByCreatedBy(currentUser);

        for (BulkUpdateMonumentSuggestion bulkUpdateSuggestion : bulkUpdateSuggestions) {
            bulkUpdateSuggestion.setUpdateSuggestions(this.updateSuggestionRepository.getAllByBulkUpdateSuggestionId(bulkUpdateSuggestion.getId()));
        }

        return this.bulkUpdateSuggestionRepository.getAllByCreatedBy(currentUser);
    }

    /**
     * Generates a search for BulkUpdateMonumentSuggestions based on the matching specified parameters
     * May make use of the pg_tgrm similarity function
     * @param searchQuery - The search query String that will be used to search against Users names and emails
     * @param isApproved - True to filter the BulkUpdateMonumentSuggestions to only ones that are approved,
     * False otherwise
     * @param isRejected - True to filter the BulkUpdateMonumentSuggestions to only ones that are rejected,
     * False otherwise
     * @param page - The page number of BulkUpdateMonumentSuggestion results to return
     * @param limit - The maximum number of BulkUpdateMonumentSuggestion results to return
     * @return - List<BulkUpdateMonumentSuggestion> - List of BulkCreateMonumentSuggestion results based on the specified
     * search parameters
     */
    public List<BulkUpdateMonumentSuggestion> search(String searchQuery, boolean isApproved, boolean isRejected,
                                                     String page, String limit){
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<BulkUpdateMonumentSuggestion> query = this.createCriteriaQuery(builder, false);
        Root<BulkUpdateMonumentSuggestion> root = this.createRoot(query);
        query.select(root);

        //Only perform the join to User if we need to
        Join<BulkUpdateMonumentSuggestion, User> userJoin = null;
        if (!isNullOrEmpty(searchQuery)) {
            userJoin = root.join("createdBy");
        }

        SearchHelper.buildSuggestionSearchQuery(builder, query, root, userJoin, searchQuery, isApproved, isRejected,
                true, false);

        return limit != null
                ? page != null
                    ? this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1)
                    : this.getWithCriteriaQuery(query, Integer.parseInt(limit))
                : this.getWithCriteriaQuery(query);
    }

    /**
     * Count the total number of results for a BulkCreateMonumentSuggestion search
     * @see BulkUpdateSuggestionService#search(String, boolean, boolean, String, String)
     */
    public Integer countSearchResults(String searchQuery, boolean isApproved, boolean isRejected) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<BulkUpdateMonumentSuggestion> root = query.from(BulkUpdateMonumentSuggestion.class);
        query.select(builder.count(root));

        // Only perform the join to User if we need to
        Join<BulkUpdateMonumentSuggestion, User> userJoin = null;
        if (!isNullOrEmpty(searchQuery)) {
            userJoin = root.join("createdBy");
        }

        SearchHelper.buildSuggestionSearchQuery(builder, query, root, userJoin, searchQuery, isApproved, isRejected,
                false, false);

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
    }
}
