package com.monumental.controllers;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SearchController {

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private TagService tagService;

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
     * @return            Matching Monuments based on their title, artist or location
     */
    @GetMapping("/api/search/monuments")
    public List<Monument> searchMonuments(@RequestParam(required = false, value = "q") String searchQuery,
                                          @RequestParam(required = false, defaultValue = "1") String page,
                                          @RequestParam(required = false, defaultValue = "25") String limit,
                                          @RequestParam(required = false, value = "lat") Double latitude,
                                          @RequestParam(required = false, value = "lon") Double longitude,
                                          @RequestParam(required = false, value = "d", defaultValue = "25") Integer distance,
                                          @RequestParam(required = false) List<String> tags,
                                          @RequestParam(required = false) List<String> materials,
                                          @RequestParam(required = false, value = "sort", defaultValue = "relevance") String sortType) {
        return this.monumentService.search(
                searchQuery, page, limit, latitude, longitude, distance, tags, materials,
                MonumentService.SortType.valueOf(sortType.toUpperCase())
        );
    }

    /**
     * @return Total number of results for a Monument search
     */
    @GetMapping("/api/search/monuments/count")
    public Integer countMonumentSearch(@RequestParam(required = false, value = "q") String searchQuery,
                                       @RequestParam(required = false, value = "lat") Double latitude,
                                       @RequestParam(required = false, value = "lon") Double longitude,
                                       @RequestParam(required = false, value = "d", defaultValue = "25") Integer distance,
                                       @RequestParam(required = false) List<String> tags,
                                       @RequestParam(required = false) List<String> materials) {
        return this.monumentService.countSearchResults(searchQuery, latitude, longitude, distance, tags, materials);
    }

    @GetMapping("/api/search/tags")
    public List<Tag> searchTags(@RequestParam(required = false, value = "q") String searchQuery,
                                @RequestParam(required = false, value = "materials") Boolean isMaterial) {
        return this.tagService.search(searchQuery, isMaterial);
    }
}
