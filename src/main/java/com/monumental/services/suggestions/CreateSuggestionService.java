package com.monumental.services.suggestions;

import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
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
public class CreateSuggestionService extends ModelService<CreateMonumentSuggestion> {

    @Autowired
    private UserService userService;

    @Autowired
    private CreateSuggestionRepository createSuggestionRepository;

    /**
     * Get all CreateMonumentSuggestions created by the currently logged in User that are not part of a
     * BulkCreateMonumentSuggestion
     *
     * @return List<CreateMonumentSuggestion> - List of CreateMonumentSuggestions created by the currently logged in
     * User that are not part of a BulkCreateMonumentSuggestion
     * @throws UnauthorizedException - If no User is currently logged in
     */
    public List<CreateMonumentSuggestion> getCreateMonumentSuggestions() throws UnauthorizedException {
        User currentUser = this.userService.getCurrentUser();
        return this.createSuggestionRepository.getAllByCreatedByAndBulkCreateSuggestionIsNull(currentUser);
    }

    /**
     * Generates a search for CreateMonumentSuggestions based on the matching specified parameters
     * May make use of the pg_tgrm similarity function
     *
     * @param searchQuery - The search query String that will be used to search against Users names and emails
     * @param isApproved  - True to filter the CreateMonumentSuggestions to only ones that are approved, False otherwise
     * @param isRejected  - True to filter the CreateMonumentSuggestions to only ones that are rejected, False otherwise
     * @param page        - The page number of CreateMonumentSuggestion results to return
     * @param limit       - The maximum number of CreateMonumentSuggestion results to return
     * @return List<CreateMonumentSuggestion> - List of CreateMonumentSuggestion results based on the specified search
     * parameters
     */
    public List<CreateMonumentSuggestion> search(String searchQuery, boolean isApproved, boolean isRejected,
                                                 String page, String limit) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<CreateMonumentSuggestion> query = this.createCriteriaQuery(builder, false);
        Root<CreateMonumentSuggestion> root = this.createRoot(query);
        query.select(root);

        // Only perform the join to User if we need to
        Join<CreateMonumentSuggestion, User> userJoin = null;
        if (!isNullOrEmpty(searchQuery)) {
            userJoin = root.join("createdBy");
        }

        SearchHelper.buildSuggestionSearchQuery(builder, query, root, userJoin, searchQuery, isApproved, isRejected,
                true, true);

        return limit != null
                ? page != null
                ? this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1)
                : this.getWithCriteriaQuery(query, Integer.parseInt(limit))
                : this.getWithCriteriaQuery(query);
    }

    /**
     * Count the total number of results for a CreateMonumentSuggestion search
     *
     * @see CreateSuggestionService#search(String, boolean, boolean, String, String)
     */
    public Integer countSearchResults(String searchQuery, boolean isApproved, boolean isRejected) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<CreateMonumentSuggestion> root = query.from(CreateMonumentSuggestion.class);
        query.select(builder.count(root));

        // Only perform the join to User if we need to
        Join<CreateMonumentSuggestion, User> userJoin = null;
        if (!isNullOrEmpty(searchQuery)) {
            userJoin = root.join("createdBy");
        }

        SearchHelper.buildSuggestionSearchQuery(builder, query, root, userJoin, searchQuery, isApproved, isRejected,
                false, true);

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
    }
}
