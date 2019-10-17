package com.monumental.controllers;

import com.monumental.models.Tag;
import com.monumental.services.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TagController {

    @Autowired
    TagService tagService;

    @GetMapping("/api/tags")
    public List<Tag> getTags(@RequestParam Integer monumentId) {
        return this.tagService.getByMonumentId(monumentId);
    }
}
