package com.monumental.services.suggestions;

import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.User;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.services.ModelService;
import com.monumental.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.util.List;

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
     * @param page - The page number of CreateMonumentSuggestion results to return
     * @param limit - The maximum number of CreateMonumentSuggestion results to return
     * @return List<CreateMonumentSuggestion> - List of CreateMonumentSuggestion results based on the specified search
     * parameters
     */
    public List<CreateMonumentSuggestion> search(String title, String artist, Double latitude, Double longitude,
                                                 Double distance, String page, String limit) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<CreateMonumentSuggestion> query = this.createCriteriaQuery(builder, false);
        Root<CreateMonumentSuggestion> root = this.createRoot(query);
        query.select(root);

        this.buildSearchQuery(builder, query, root, title, artist, latitude, longitude, distance);


    }
}
