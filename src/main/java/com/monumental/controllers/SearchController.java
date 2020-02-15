package com.monumental.controllers;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.repositories.MonumentRepository;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import com.monumental.util.string.StringHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
public class SearchController {

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private TagService tagService;

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
     * @return            Matching Monuments based on their title, artist or location
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
                                          @RequestParam(required = false) Integer decade) {
        Date startDate = StringHelper.parseNullableDate(start);
        Date endDate = StringHelper.parseNullableDate(end);
        return this.monumentService.search(
                searchQuery, page, limit, 0.1, latitude, longitude, distance, tags, materials,
                MonumentService.SortType.valueOf(sortType.toUpperCase()),
                startDate, endDate, decade
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
                                       @RequestParam(required = false) Integer decade) {
        Date startDate = StringHelper.parseNullableDate(start);
        Date endDate = StringHelper.parseNullableDate(end);
        return this.monumentService.countSearchResults(
            searchQuery, latitude, longitude, distance, tags, materials,
            startDate, endDate, decade
        );
    }

    @GetMapping("/api/search/tags")
    public List<Tag> searchTags(@RequestParam(required = false, value = "q") String searchQuery,
                                @RequestParam(required = false, value = "materials") Boolean isMaterial) {
        return this.tagService.search(searchQuery, isMaterial);
    }

    @GetMapping("/api/search/duplicates")
    public List<Monument> searchMonuments(@RequestParam(required = true, value = "id") Integer id) {
        Monument monument = this.monumentRepository.getOne(id);
        return this.monumentService.findDuplicateMonuments(monument);
    }
}
