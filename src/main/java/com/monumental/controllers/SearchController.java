package com.monumental.controllers;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Root;
import java.util.List;

@RestController
public class SearchController {

    @Autowired
    private MonumentService monumentService;

    /**
     * This function lets you search monuments using the q query param
     * Ex: GET http://localhost:8080/api/search?q=Memorial
     * TODO: Possibly search related tables such as Tags
     * @param searchQuery The search query string
     * @return            Matching Monuments based on their title
     */
    @GetMapping("/api/search")
    public List<Monument> searchMonuments(@RequestParam(required = false, value = "q") String searchQuery,
                                          @RequestParam(required = false, defaultValue = "1", value = "page") String pageString,
                                          @RequestParam(required = false, defaultValue = "25", value = "limit") String limitString) {

        Integer page = null;
        if (pageString != null) page = Integer.parseInt(pageString);
        Integer limit = null;
        if (limitString != null) limit = Integer.parseInt(limitString);

        try {
            CriteriaBuilder builder = monumentService.getCriteriaBuilder();
            CriteriaQuery<Monument> query = monumentService.createCriteriaQuery(builder, false);
            Root<Monument> root = monumentService.createRoot(query);

            if (searchQuery != null) {
                query.where(
                    builder.or(
                        builder.equal(builder.function("fts", Boolean.class, root.get("title"), builder.literal(searchQuery)), true),
                        builder.equal(builder.function("fts", Boolean.class, root.get("artist"), builder.literal(searchQuery)), true)
                    )
                );
            }

            return this.monumentService.getWithCriteriaQuery(query);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
