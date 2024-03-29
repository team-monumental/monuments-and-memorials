package com.monumental.controllers;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.models.User;
import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import com.monumental.repositories.MonumentRepository;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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

    @Autowired
    private MonumentRepository monumentRepository;

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
                                          @RequestParam(required = false, value = "state") String state,
                                          @RequestParam(required = false) List<String> tags,
                                          @RequestParam(required = false) List<String> materials,
                                          @RequestParam(required = false, value = "sort", defaultValue = "relevance") String sortType,
                                          @RequestParam(required = false) String start,
                                          @RequestParam(required = false) String end,
                                          @RequestParam(required = false) Integer decade,
                                          @RequestParam(required = false, defaultValue = "true") Boolean onlyActive,
                                          @RequestParam(required = false) Integer activeStart,
                                          @RequestParam(required = false) Integer activeEnd,
                                          @RequestParam(required = false, defaultValue = "false") Boolean hideTemporary,
                                          @RequestParam(value = "cascade", defaultValue = "false") Boolean cascade)
            throws UnauthorizedException, AccessDeniedException {
        if (!onlyActive) {
            this.userService.requireUserIsInRoles(Role.PARTNER_OR_ABOVE);
        }
        Date startDate = StringHelper.parseNullableDate(start);
        Date endDate = StringHelper.parseNullableDate(end);
        List<Monument> monuments = this.monumentService.search(
                searchQuery, page, limit, 0.1, latitude, longitude, distance, state, tags, materials,
                MonumentService.SortType.valueOf(sortType.toUpperCase()),
                startDate, endDate, decade, onlyActive, activeStart, activeEnd, hideTemporary
        );

        if (cascade) {
            monuments.forEach(favorite -> this.monumentService.initializeAllLazyLoadedCollections(monuments));
        }

        return monuments;
    }

    /**
     * @return Total number of results for a Monument search
     */
    @GetMapping("/api/search/monuments/count")
    public Integer countMonumentSearch(@RequestParam(required = false, value = "q") String searchQuery,
                                       @RequestParam(required = false, value = "lat") Double latitude,
                                       @RequestParam(required = false, value = "lon") Double longitude,
                                       @RequestParam(required = false, value = "d", defaultValue = "25.0") Double distance,
                                       @RequestParam(required = false) String state,
                                       @RequestParam(required = false) List<String> tags,
                                       @RequestParam(required = false) List<String> materials,
                                       @RequestParam(required = false) String start,
                                       @RequestParam(required = false) String end,
                                       @RequestParam(required = false) Integer decade,
                                       @RequestParam(required = false, defaultValue = "true") Boolean onlyActive,
                                       @RequestParam(required = false) Integer activeStart,
                                       @RequestParam(required = false) Integer activeEnd,
                                       @RequestParam(required = false, defaultValue = "false") Boolean hideTemporary)
            throws UnauthorizedException, AccessDeniedException {
        if (!onlyActive) {
            this.userService.requireUserIsInRoles(Role.PARTNER_OR_ABOVE);
        }
        Date startDate = StringHelper.parseNullableDate(start);
        Date endDate = StringHelper.parseNullableDate(end); 

        return this.monumentService.countSearchResults(
            searchQuery, latitude, longitude, distance, state, tags, materials,
            startDate, endDate, decade, onlyActive, activeStart, activeEnd, hideTemporary
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
                                                                  @RequestParam(required = false, value  = "approved") boolean isApproved,
                                                                  @RequestParam(required = false, value = "rejected") boolean isRejected,
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
                                                @RequestParam(required = false, value = "approved") boolean isApproved,
                                                @RequestParam(required = false, value = "rejected") boolean isRejected) {
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
                                                                  @RequestParam(required = false, value  = "approved") boolean isApproved,
                                                                  @RequestParam(required = false, value = "rejected") boolean isRejected,
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
                                                @RequestParam(required = false, value = "approved") boolean isApproved,
                                                @RequestParam(required = false, value = "rejected") boolean isRejected) {
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
                                                                          @RequestParam(required = false, value  = "approved") boolean isApproved,
                                                                          @RequestParam(required = false, value = "rejected") boolean isRejected,
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
                                                    @RequestParam(required = false, value = "approved") boolean isApproved,
                                                    @RequestParam(required = false, value = "rejected") boolean isRejected) {
        return this.bulkCreateSuggestionService.countSearchResults(searchQuery, isApproved, isRejected);
    }

    /**
     * Get the total number of pending MonumentSuggestions
     * @return Integer for the total number of pending MonumentSuggestions
     */
    @GetMapping("/api/search/suggestions/pending")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public Integer countPendingSuggestions() {
        return this.createSuggestionService.countSearchResults(null, false, false) +
                this.updateSuggestionService.countSearchResults(null, false, false) +
                this.bulkCreateSuggestionService.countSearchResults(null, false, false);
    }

    /**
     * Get all of the pending UpdateMonumentSuggestions for the Monument with the specified monumentId, if it exists
     * @param monumentId - Integer ID of the Monument to get the other pending UpdateMonumentSuggestions for
     * @return List<UpdateMonumentSuggestion> - List of pending UpdateMonumentSuggestions for the Monument with the
     * specified monumentId, if it exists
     * @throws ResourceNotFoundException - If the Monument with the specified monumentId does not exist
     */
    @GetMapping("/api/search/suggestions/update/pending/{id}")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public List<UpdateMonumentSuggestion> getPendingUpdateSuggestionsForMonument(@PathVariable("id") Integer monumentId)
            throws ResourceNotFoundException {
        Optional<Monument> optional = this.monumentRepository.findById(monumentId);
        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("The requested Monument or Memorial does not exist");
        }

        return this.updateSuggestionService.getPendingSuggestionsForMonument(monumentId);
    }

    /**
     * Get all of the Monuments created by name
     * @param name - a user's name
     * @return List<Monument> - List of all of the Monuments
     * @throws UnauthorizedException - If trying to get inactive monuments and not logged in
     */
    @GetMapping("/api/search/user/monument")
    @PreAuthorize(Authorization.isAdmin)
    public List<Monument> getAllMonumentsByCreatedByName(@RequestParam(required = false) String name,
                                                       @RequestParam(required = false, defaultValue = "1") String page,
                                                       @RequestParam(required = false, defaultValue = "25") String limit) {
        List<Monument> foundMonuments = new ArrayList<Monument>();
        List<User> foundUsers = this.userService.search(name, null, null, page, limit);
        for (User user: foundUsers) {
            foundMonuments.addAll(this.monumentRepository.findAllByCreatedById(user.getId()));
        }
        if (foundMonuments.size() > Integer.parseInt(limit)) {
            return foundMonuments.subList(0, Integer.parseInt(limit));
        }
        return foundMonuments;
    }
    
    /**
     * Get all the monuments created by a particular user id
     * @param id - the target user's ID
     * @return List<Monument> - List of all monuments created by that user id
     * @throws UnauthorizedException - If trying to get inactive monuments and not logged in
     */
    @GetMapping("api/search/user/monumentsById")
    @PreAuthorize(Authorization.isAdmin)
    public List<Monument> getAllMonumentsByCreatedById(@RequestParam(required = false) int id){
        List<Monument> foundMonuments = new ArrayList<Monument>();
        foundMonuments.addAll(this.monumentRepository.findAllByCreatedById(id));
        return foundMonuments;
    }
}
