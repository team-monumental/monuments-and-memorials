package com.monumental.controllers;

import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.models.User;
import com.monumental.security.Authentication;
import com.monumental.security.Authorization;
import com.monumental.security.Role;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import com.monumental.services.UserService;
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
     * @return            Matching Monuments based on the search criteria
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
     * @return            Matching Users based on the search criteria
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
    public Integer countUsersSearch(@RequestParam(required = false) String name,
                                    @RequestParam(required = false) String email,
                                    @RequestParam(required = false) String role) {
        return this.userService.countSearchResults(name, email, role);
    }
}
