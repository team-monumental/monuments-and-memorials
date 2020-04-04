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

import javax.persistence.criteria.*;
import javax.transaction.Transactional;
import java.util.ArrayList;
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
     * @param searchQuery - The search query String that will be used to search against Users names and emails
     * @param isApproved - True to filter the CreateMonumentSuggestions to only ones that are approved, False otherwise
     * @param isRejected - True to filter the CreateMonumentSuggestions to only ones that are rejected, False otherwise
     * @param page - The page number of CreateMonumentSuggestion results to return
     * @param limit - The maximum number of CreateMonumentSuggestion results to return
     * @return List<CreateMonumentSuggestion> - List of CreateMonumentSuggestion results based on the specified search
     * parameters
     */
    public List<CreateMonumentSuggestion> search(String searchQuery, Boolean isApproved, Boolean isRejected,
                                                 String page, String limit) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<CreateMonumentSuggestion> query = this.createCriteriaQuery(builder, false);
        Root<CreateMonumentSuggestion> root = this.createRoot(query);
        query.select(root);

        this.buildSearchQuery(builder, query, root, searchQuery, isApproved, isRejected);

        return limit != null
            ? page != null
                ? this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1)
                : this.getWithCriteriaQuery(query, Integer.parseInt(limit))
            : this.getWithCriteriaQuery(query);
    }

    /**
     * Creates a search query on various fields of CreateMonumentSuggestion and adds it to the specified CriteriaQuery
     * @param builder - The CriteriaBuilder to use to help build the CriteriaQuery
     * @param query - The CriteriaQuery to add the searching logic to
     * @param root - The Root to use with the CriteriaQuery
     * @param searchQuery - The search query String that will be used to search against Users names and emails using
     * pg_tgrm
     * @param isApproved - True to filter to only approved CreateMonumentSuggestions, False otherwise
     * @param isRejected - True to filter to only rejected CreateMonumentSuggestions, False otherwise
     */
    private void buildSearchQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery,
                                  boolean isApproved, boolean isRejected) {
        List<Predicate> predicates = new ArrayList<>();

        if (!isNullOrEmpty(searchQuery)) {
            predicates.add(this.buildUserSearchQuery(builder, query, searchQuery));
        }
        if (isApproved) {
            predicates.add(builder.equal(root.get("isApproved"), builder.literal(true)));
        }
        if (isRejected) {
            predicates.add(builder.equal(root.get("isRejected"), builder.literal(true)));
        }

        SearchHelper.executeQueryWithPredicates(builder, query, predicates);
    }

    /**
     * Uses a sub-query on user to create a filter on CreateMonumentSuggestions so that only those with a created by
     * User that has a similar first name, last name or email to the specified searchQuery are returned
     * @param builder - The CriteriaBuilder to use to help build the query
     * @param query - The CriteriaQuery to add the searching logic to
     * @param searchQuery - The search query String to filter Users names and emails by
     * @return Predicate - Predicate for the user search filter using the specified builder, query and searchQuery
     */
    @SuppressWarnings("unchecked")
    private Predicate buildUserSearchQuery(CriteriaBuilder builder, CriteriaQuery query, String searchQuery) {
        // Create a Sub-query for the Join
        Subquery userSubQuery = query.subquery(Long.class);
        Root userRoot = userSubQuery.from(User.class);

        // Join from the create_monument_suggestion table to the user table
        Join<CreateMonumentSuggestion, User> users = userRoot.join("createdBy");

        // Build the similarity expressions for first name, last name and email
        List<Expression<Number>> expressions = new ArrayList<>();
        Expression<Number> firstNameExpression = SearchHelper.buildSimilarityExpression(builder, users, searchQuery, "firstName");
        Expression<Number> lastNameExpression = SearchHelper.buildSimilarityExpression(builder, users, searchQuery, "lastName");
        Expression<Number> emailExpression = SearchHelper.buildSimilarityExpression(builder, users, searchQuery, "email");
        expressions.add(firstNameExpression);
        expressions.add(lastNameExpression);
        expressions.add(emailExpression);

        // Order the similarity expression results by similarity score
        SearchHelper.orderSimilarityResults(builder, query, expressions);

        // Select the CreateMonumentSuggestions where the User's first name, last name or email are similar to the
        // specified searchQuery
        return builder.or(
            SearchHelper.buildSimilarityPredicate(builder, firstNameExpression, 0.1),
            SearchHelper.buildSimilarityPredicate(builder, lastNameExpression, 0.1),
            SearchHelper.buildSimilarityPredicate(builder, emailExpression, 0.1)
        );
    }

    /**
     * Count the total number of results for a CreateMonumentSuggestion search
     * @see CreateSuggestionService#search(String, Boolean, Boolean, String, String)
     */
    public Integer countSearchResults(String searchQuery, Boolean isApproved, Boolean isRejected) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<CreateMonumentSuggestion> root = query.from(CreateMonumentSuggestion.class);
        query.select(builder.countDistinct(root));

        this.buildSearchQuery(builder, query, root, searchQuery, isApproved, isRejected);

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
    }
}
