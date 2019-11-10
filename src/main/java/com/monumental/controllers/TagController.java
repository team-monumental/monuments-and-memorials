package com.monumental.controllers;

import com.monumental.models.Tag;
import com.monumental.services.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.InvalidParameterException;
import java.util.List;

@RestController
public class TagController {

    @Autowired
    TagService tagService;

    @GetMapping("/api/tags")
    public List<Tag> getTagsByMonument(@RequestParam(required = false) Integer monumentId,
                                       @RequestParam(required = false) String name,
                                       @RequestParam(required = false) List<String> names) {
        if (monumentId != null) {
            return this.tagService.getByMonumentId(monumentId);
        } else if (name != null) {
            return this.tagService.getByName(name, false);
        } else if (names != null && names.size() > 0) {
            return this.tagService.getByNames(names);
        } else {
            throw new InvalidParameterException("Please specify a monument id or tag name(s).");
        }
    }
}
