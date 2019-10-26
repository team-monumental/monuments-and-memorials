package com.monumental.controllers;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SearchController {

    @Autowired
    private MonumentService monumentService;

    /**
     * This function lets you search Monuments via a few different request parameters
     * Ex: GET http://localhost:8080/api/search?q=Memorial&limit=25&page=1
     * Ex: GET http://locahose:8080/api/search?lat=37.383762&lon=-109.072473&miles=20
     * @param searchQuery The search query string
     * @param page The results page number
     * @param limit The number used to limit the maximum result set
     * @param latitude The latitude of the comparison point
     * @param longitude The longitude of the comparison point
     * @param miles The number of miles from the comparison point for search
     * @return            Matching Monuments based on their title, artist or location
     */
    @GetMapping("/api/search")
    public List<Monument> searchMonuments(@RequestParam(required = false, value = "q") String searchQuery,
                                          @RequestParam(required = false, defaultValue = "1") String page,
                                          @RequestParam(required = false, defaultValue = "25") String limit,
                                          @RequestParam(required = false, value = "lat") String latitude,
                                          @RequestParam(required = false, value = "lon") String longitude,
                                          @RequestParam(required = false, defaultValue = "25") String miles) {
        return monumentService.search(searchQuery, page, limit, latitude, longitude, miles);
    }

    /**
     * @return Total number of results for a monument search
     */
    @GetMapping("/api/search/count")
    public Integer countMonumentSearch(@RequestParam(required = false, value = "q") String searchQuery,
                                       @RequestParam(required = false, value = "lat") String latitude,
                                       @RequestParam(required = false, value = "lon") String longitude,
                                       @RequestParam(required = false, defaultValue = "25") String miles) {
        return monumentService.countSearchResults(searchQuery, latitude, longitude, miles);
    }
}
