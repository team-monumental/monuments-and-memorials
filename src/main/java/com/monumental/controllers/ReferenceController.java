package com.monumental.controllers;

import com.monumental.models.Reference;
import com.monumental.services.ReferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ReferenceController {

    @Autowired
    ReferenceService referenceService;

    @GetMapping("/api/references")
    public List<Reference> getImages(@RequestParam Integer monumentId) {
        return this.referenceService.getByMonumentId(monumentId);
    }
}