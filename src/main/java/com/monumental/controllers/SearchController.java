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
     * This function lets you search monuments using the q query param
     * Ex: GET http://localhost:8080/api/search?q=Memorial&limit=25&page=1
     * @param searchQuery The search query string
     * @return            Matching Monuments based on their title
     */
    @GetMapping("/api/search")
    public List<Monument> searchMonuments(@RequestParam(required = false, value = "q") String searchQuery,
                                          @RequestParam(required = false, defaultValue = "1") String page,
                                          @RequestParam(required = false, defaultValue = "25") String limit) {
        return monumentService.search(searchQuery, page, limit);
    }

    /**
     * @return Total number of results for a monument search
     */
    @GetMapping("/api/search/count")
    public Integer countMonumentSearch(@RequestParam(required = false, value = "q") String searchQuery) {
        return monumentService.countSearchResults(searchQuery);
    }
}
