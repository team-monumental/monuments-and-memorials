package com.monumental.controllers;

import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.models.User;
import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import com.monumental.security.Authentication;
import com.monumental.security.Authorization;
import com.monumental.security.Role;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import com.monumental.services.UserService;
import com.monumental.services.suggestions.BulkCreateSuggestionService;
import com.monumental.services.suggestions.CreateSuggestionService;
import com.monumental.services.suggestions.UpdateSuggestionService;
import com.monumental.util.string.StringHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;

@RestController
public class SearchController {

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private TagService tagService;

    @Autowired
    private UserService userService;

    @Autowired
    private CreateSuggestionService createSuggestionService;

    @Autowired
    private UpdateSuggestionService updateSuggestionService;

    @Autowired
    private BulkCreateSuggestionService bulkCreateSuggestionService;

    /**
     * This function lets you search Monuments via a few different request parameters
     * Ex: GET http://localhost:8080/api/search/monuments/?q=Memorial&limit=25&page=1
     * Ex: GET http://locahose:8080/api/search/monuments/?lat=37.383762&lon=-109.072473&distance=20
     * @param searchQuery - The search query string
     * @param page - The Monument results page number
     * @param limit - The maximum number of Monument results
     * @param latitude - The latitude of the comparison point
     * @param longitude - The longitude of the comparison point
     * @param distance - The distance from the comparison point to search in, units of miles
     * @param sortType - The way in which to sort the results by
     * @param onlyActive - If true, only active monuments will be searched. If false, both inactive and active will be searched
     * @return List<Monument> - Matching Monuments based on the search criteria
     * @throws AccessDeniedException - If trying to search for inactive monuments without being a partner or above
     * @throws UnauthorizedException - If trying to search for inactive monuments and not logged in
     */
    @GetMapping("/api/search/monuments")
    public List<Monument> searchMonuments(@RequestParam(required = false, value = "q") String searchQuery,
                                          @RequestParam(required = false, defaultValue = "1") String page,
                                          @RequestParam(required = false, defaultValue = "25") String limit,
                                          @RequestParam(required = false, value = "lat") Double latitude,
                                          @RequestParam(required = false, value = "lon") Double longitude,
                                          @RequestParam(required = false, value = "d", defaultValue = "25.0") Double distance,
                                          @RequestParam(required = false) List<String> tags,
                                          @RequestParam(required = false) List<String> materials,
                                          @RequestParam(required = false, value = "sort", defaultValue = "relevance") String sortType,
                                          @RequestParam(required = false) String start,
                                          @RequestParam(required = false) String end,
                                          @RequestParam(required = false) Integer decade,
                                          @RequestParam(required = false, defaultValue = "true") Boolean onlyActive)
            throws UnauthorizedException, AccessDeniedException {
        if (!onlyActive) {
            this.userService.requireUserIsInRoles(Role.PARTNER_OR_ABOVE);
        }
        Date startDate = StringHelper.parseNullableDate(start);
        Date endDate = StringHelper.parseNullableDate(end);
        return this.monumentService.search(
                searchQuery, page, limit, 0.1, latitude, longitude, distance, tags, materials,
                MonumentService.SortType.valueOf(sortType.toUpperCase()),
                startDate, endDate, decade, onlyActive
        );
    }

    /**
     * @return Total number of results for a Monument search
     */
    @GetMapping("/api/search/monuments/count")
    public Integer countMonumentSearch(@RequestParam(required = false, value = "q") String searchQuery,
                                       @RequestParam(required = false, value = "lat") Double latitude,
                                       @RequestParam(required = false, value = "lon") Double longitude,
                                       @RequestParam(required = false, value = "d", defaultValue = "25.0") Double distance,
                                       @RequestParam(required = false) List<String> tags,
                                       @RequestParam(required = false) List<String> materials,
                                       @RequestParam(required = false) String start,
                                       @RequestParam(required = false) String end,
                                       @RequestParam(required = false) Integer decade,
                                       @RequestParam(required = false, defaultValue = "true") Boolean onlyActive)
            throws UnauthorizedException, AccessDeniedException {
        if (!onlyActive) {
            this.userService.requireUserIsInRoles(Role.PARTNER_OR_ABOVE);
        }
        Date startDate = StringHelper.parseNullableDate(start);
        Date endDate = StringHelper.parseNullableDate(end);
        return this.monumentService.countSearchResults(
            searchQuery, latitude, longitude, distance, tags, materials,
            startDate, endDate, decade, onlyActive
        );
    }

    @GetMapping("/api/search/tags")
    public List<Tag> searchTags(@RequestParam(required = false, value = "q") String searchQuery,
                                @RequestParam(required = false, value = "materials") Boolean isMaterial) {
        return this.tagService.search(searchQuery, isMaterial);
    }

    @GetMapping("/api/search/duplicates")
    @PreAuthorize(Authentication.isAuthenticated)
    public List<Monument> searchDuplicates(@RequestParam(value = "title") String title,
                                           @RequestParam(required = false, value = "lat") Double latitude,
                                           @RequestParam(required = false, value = "lon") Double longitude,
                                           @RequestParam(required = false, value = "address") String address,
                                           @RequestParam(required = false, defaultValue = "true") Boolean onlyActive)
            throws UnauthorizedException, AccessDeniedException {
        if (!onlyActive) {
            this.userService.requireUserIsInRoles(Role.PARTNER_OR_ABOVE);
        }
        if (latitude == null && longitude == null && address == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Latitude AND longitude OR address is required");
        }
        return this.monumentService.findDuplicateMonuments(title, latitude, longitude, address, onlyActive);
    }

    /**
     * This function lets you search Users via a few different request parameters
     * @param name - The user name search query string
     * @param email - The user email search query string
     * @param role - The user role to filter by
     * @param page - The User results page number
     * @param limit - The maximum number of User results
     * @return List<User> - Matching Users based on the search criteria
     */
    @GetMapping("/api/search/users")
    @PreAuthorize(Authorization.isAdmin)
    public List<User> searchUsers(@RequestParam(required = false) String name,
                                  @RequestParam(required = false) String email,
                                  @RequestParam(required = false) String role,
                                  @RequestParam(required = false, defaultValue = "1") String page,
                                  @RequestParam(required = false, defaultValue = "25") String limit) {
        return this.userService.search(name, email, role, page, limit);
    }

    /**
     * @return Total number of results for a User search
     */
    @GetMapping("/api/search/users/count")
    @PreAuthorize(Authorization.isAdmin)
    public Integer countUsersSearch(@RequestParam(required = false) String name,
                                    @RequestParam(required = false) String email,
                                    @RequestParam(required = false) String role) {
        return this.userService.countSearchResults(name, email, role);
    }

    /**
     * Search CreateMonumentSuggestions via various request parameters
     * @param searchQuery - Search query String to use to search created by Users by name and email
     * @param isApproved - True to filter the CreateMonumentSuggestions to only approved ones, False otherwise
     * @param isRejected - True to filter the CreateMonumentSuggestions to only rejected ones, False otherwise
     * @param page - The CreateMonumentSuggestions results page number
     * @param limit - The maximum number of CreateMonumentSuggestion results
     * @return List<CreateMonumentSuggestion> - Matching CreateMonumentSuggestions based on the search criteria
     */
    @GetMapping("/api/search/suggestions/create")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public List<CreateMonumentSuggestion> searchCreateSuggestions(@RequestParam(required = false, value = "q") String searchQuery,
                                                                  @RequestParam(required = false, value  = "isApproved") boolean isApproved,
                                                                  @RequestParam(required = false, value = "isRejected") boolean isRejected,
                                                                  @RequestParam(required = false, defaultValue = "1") String page,
                                                                  @RequestParam(required = false, defaultValue = "25") String limit) {
        return this.createSuggestionService.search(searchQuery, isApproved, isRejected, page, limit);
    }

    /**
     * @return - Total number of results for a CreateMonumentSuggestion search
     */
    @GetMapping("/api/search/suggestions/create/count")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Integer countCreateSuggestionsSearch(@RequestParam(required = false, value = "q") String searchQuery,
                                                @RequestParam(required = false, value = "isApproved") boolean isApproved,
                                                @RequestParam(required = false, value = "isRejected") boolean isRejected) {
        return this.createSuggestionService.countSearchResults(searchQuery, isApproved, isRejected);
    }

    /**
     * Search UpdateMonumentSuggestions via various request parameters
     * @param searchQuery - Search query String to use to search created by Users by name and email
     * @param isApproved - True to filter the UpdateMonumentSuggestions to only approved ones, False otherwise
     * @param isRejected - True to filter the UpdateMonumentSuggestions to only rejected ones, False otherwise
     * @param page - The UpdateMonumentSuggestion results page number
     * @param limit - The maximum number of UpdateMonumentSuggestion results
     * @return List<UpdateMonumentSuggestion> - Matching UpdateMonumentSuggestions based on the search criteria
     */
    @GetMapping("/api/search/suggestions/update")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public List<UpdateMonumentSuggestion> searchUpdateSuggestions(@RequestParam(required = false, value = "q") String searchQuery,
                                                                  @RequestParam(required = false, value  = "isApproved") boolean isApproved,
                                                                  @RequestParam(required = false, value = "isRejected") boolean isRejected,
                                                                  @RequestParam(required = false, defaultValue = "1") String page,
                                                                  @RequestParam(required = false, defaultValue = "25") String limit) {
        return this.updateSuggestionService.search(searchQuery, isApproved, isRejected, page, limit);
    }

    /**
     * @return - Total number of results for an UpdateMonumentSuggestion search
     */
    @GetMapping("/api/search/suggestions/update/count")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Integer countUpdateSuggestionsSearch(@RequestParam(required = false, value = "q") String searchQuery,
                                                @RequestParam(required = false, value = "isApproved") boolean isApproved,
                                                @RequestParam(required = false, value = "isRejected") boolean isRejected) {
        return this.updateSuggestionService.countSearchResults(searchQuery, isApproved, isRejected);
    }

    /**
     * Search BulkCreateMonumentSuggestions via various request parameters
     * @param searchQuery - Search query String to use to search created by Users by name and email
     * @param isApproved - True to filter the BulkCreateMonumentSuggestions to only approved ones, False otherwise
     * @param isRejected - True to filter the BulkCreateMonumentSuggestions to only rejected ones, False otherwise
     * @param page - The BulkCreateMonumentSuggestions results page number
     * @param limit - The maximum number of BulkCreateMonumentSuggestion results
     * @return List<BulkCreateMonumentSuggestion> - Matching BulkCreateMonumentSuggestions based on the search criteria
     */
    @GetMapping("/api/search/suggestions/bulk")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public List<BulkCreateMonumentSuggestion> searchBulkCreateSuggestions(@RequestParam(required = false, value = "q") String searchQuery,
                                                                          @RequestParam(required = false, value  = "isApproved") boolean isApproved,
                                                                          @RequestParam(required = false, value = "isRejected") boolean isRejected,
                                                                          @RequestParam(required = false, defaultValue = "1") String page,
                                                                          @RequestParam(required = false, defaultValue = "25") String limit) {
        return this.bulkCreateSuggestionService.search(searchQuery, isApproved, isRejected, page, limit);
    }

    /**
     * @return - Total number of results for a BulkCreateMonumentSuggestion search
     */
    @GetMapping("/api/search/suggestions/bulk/count")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Integer countBulkCreateSuggestionsSearch(@RequestParam(required = false, value = "q") String searchQuery,
                                                    @RequestParam(required = false, value = "isApproved") boolean isApproved,
                                                    @RequestParam(required = false, value = "isRejected") boolean isRejected) {
        return this.bulkCreateSuggestionService.countSearchResults(searchQuery, isApproved, isRejected);
    }
}
