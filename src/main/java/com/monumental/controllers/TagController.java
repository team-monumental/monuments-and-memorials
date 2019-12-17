package com.monumental.controllers;

import com.monumental.models.Tag;
import com.monumental.repositories.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.InvalidParameterException;
import java.util.List;

@RestController
public class TagController {

    @Autowired
    TagRepository tagRepository;

    /**
     * Endpoint for getting Tags in the database
     * If a monumentId is specified, gets all of the Tags associated with that Monument
     * If a name is specified, gets all of the Tags with that name
     * If names is specified, gets all of the Tags with any of those names
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
        if (monumentId != null) {
            return this.tagRepository.getAllByMonumentId(monumentId);
        } else if (name != null) {
            return this.tagRepository.getAllByName(name);
        } else if (names != null && names.size() > 0) {
            return this.tagRepository.getAllByNameIn(names);
        } else {
            return this.tagRepository.findAll();
        }
    }
}
