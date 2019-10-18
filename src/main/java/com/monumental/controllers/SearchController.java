package com.monumental.controllers;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class SearchController {

    @Autowired
    private MonumentService monumentService;

    /**
     * This function lets you search monuments using the q query param
     * Ex: GET http://localhost:8080/api/search?q=Memorial
     * TODO: Possibly search related tables such as Tags
     * @param q The search query string
     * @return  Matching Monuments based on their title
     */
    @GetMapping("/api/search")
    public List<Monument> searchMonuments(@RequestParam String q) {
        try {
            return this.monumentService.search(q);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }
}
