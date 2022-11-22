package com.monumental.controllers;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.repositories.TagRepository;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
public class TagController {

    @Autowired
    private TagRepository tagRepository;


    @Autowired
    public MonumentService monumentService;

    /**
     * Endpoint for getting Tags in the database
     * If a monumentId is specified, gets all of the Tags associated with that Monument
     * If a name is specified, gets all of the Tags with that name
     * If names are specified, gets all of the Tags with any of those names
     * If none of the request parameters are specified, gets all of the Tags
     * @param monumentId - Integer ID of the Monument to get all the Tags for
     * @param name - String for the name of the Tag to get
     * @param names - List<String> for all of the names of the Tags to get
     * @return List<Tag> - The appropriate Tags based on the request
     */
    @GetMapping("/api/tags")
    public List<Tag> getTags(@RequestParam(required = false) Integer monumentId,
                             @RequestParam(required = false) String name,
                             @RequestParam(required = false) List<String> names) {
        List<Tag> tags;

        if (monumentId != null) {
            tags = this.tagRepository.getAllByMonumentId(monumentId);
        } else if (name != null) {
            tags = this.tagRepository.getAllByName(name);
        } else if (names != null && names.size() > 0) {
            tags = this.tagRepository.getAllByNameIn(names);
        } else {
            tags = this.tagRepository.findAll();
        }

        tags.sort(Comparator.comparing(Tag::getName));
        return tags;
    }

    /**
     * Endpoint for getting Tags in the database
     * If a monumentId is specified, gets all of the Tags associated with that Monument
     * If a name is specified, gets all of the Tags with that name
     * If names are specified, gets all of the Tags with any of those names
     * If none of the request parameters are specified, gets all of the Tags
     * @return List<Tag> - The appropriate Tags based on the request
     */
    @PutMapping("/api/tags/update")
    public List<String> updateTags(@RequestParam(required = false) String newTagString, @RequestBody Monument monument) {
        try {
            String result = java.net.URLDecoder.decode(newTagString, StandardCharsets.UTF_8);
            ObjectMapper mapper = new ObjectMapper();
            List<String> strings = mapper.readValue(result, List.class);
            this.monumentService.updateMonumentTags(monument, strings, false);
            return strings;
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
