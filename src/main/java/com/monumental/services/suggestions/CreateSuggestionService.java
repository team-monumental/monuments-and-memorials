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
     * May make use of the pg_tgrm similarity function as well as the postgis ST_DWithin function
     * @param title - The string to search CreateMonumentSuggestion titles against, using pg_tgrm similarity
     * @param artist - The string to search CreateMonumentSuggestion artists against, using pg_tgrm similarity
     * @param latitude - The latitude of the comparison point for searching within the specified distance of
     * @param longitude - The longitude of the comparison point for searching within the specified distance of
     * @param distance - The distance from the comparison point to search in, units of miles
     * @param isApproved - True to filter the CreateMonumentSuggestions to only ones that are approved, False otherwise
     * @param isRejected - True to filter the CreateMonumentSuggestions to only ones that are rejected, False otherwise
     * @param createdByEmail - The string to search CreateMonumentSuggestion created by User emails by, using pg_tgrm similarity
     * @param page - The page number of CreateMonumentSuggestion results to return
     * @param limit - The maximum number of CreateMonumentSuggestion results to return
     * @return List<CreateMonumentSuggestion> - List of CreateMonumentSuggestion results based on the specified search
     * parameters
     */
    public List<CreateMonumentSuggestion> search(String title, String artist, Double latitude, Double longitude,
                                                 Double distance, Boolean isApproved, Boolean isRejected,
                                                 String createdByEmail, String page, String limit) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<CreateMonumentSuggestion> query = this.createCriteriaQuery(builder, false);
        Root<CreateMonumentSuggestion> root = this.createRoot(query);
        query.select(root);

        this.buildSearchQuery(builder, query, root, title, artist, latitude, longitude, distance, isApproved,
                isRejected, createdByEmail);

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
     * @param title - The string to search titles against, using pg_tgrm similarity
     * @param artist - The string to search artists against, using pg_tgrm similarity
     * @param latitude - The latitude of the comparison point to check within the specified distance of
     * @param longitude - The longitude of the comparison point to check within the specified distance of
     * @param distance - The distance from the comparison point to filter by
     * @param isApproved - True to filter to only approved CreateMonumentSuggestions, False otherwise
     * @param isRejected - True to filter to only rejected CreateMonumentSuggestions, False otherwise
     * @param createdByEmail - The string to search the CreateMonumentSuggestion created by User emails against, using
     * pg_tgrm similarity
     */
    private void buildSearchQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String title, String artist,
                                  Double latitude, Double longitude, Double distance, boolean isApproved,
                                  boolean isRejected, String createdByEmail) {
        List<Predicate> predicates = new ArrayList<>();
        List<Expression<Number>> expressions = new ArrayList<>();

        if (!isNullOrEmpty(title)) {
            Expression<Number> titleExpression = SearchHelper.buildSimilarityExpression(builder, root, title, "title");
            predicates.add(SearchHelper.buildSimilarityPredicate(builder, titleExpression, 0.1));
            expressions.add(titleExpression);
        }
        if (!isNullOrEmpty(artist)) {
            Expression<Number> artistExpression = SearchHelper.buildSimilarityExpression(builder, root, artist, "artist");
            predicates.add(SearchHelper.buildSimilarityPredicate(builder, artistExpression, 0.1));
            expressions.add(artistExpression);
        }
        // TODO: ST_DWithin Query
        if (isApproved) {
            predicates.add(builder.equal(root.get("isApproved"), builder.literal(true)));
        }
        if (isRejected) {
            predicates.add(builder.equal(root.get("isRejected"), builder.literal(true)));
        }
        if (!isNullOrEmpty(createdByEmail)) {
            //predicates.add(SearchHelper.buildCreatedByEmailQuery(builder, query, root, createdByEmail));
        }
    }
}
