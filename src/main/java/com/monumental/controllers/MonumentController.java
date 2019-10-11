package com.monumental.controllers;

import com.monumental.services.exceptions.ResourceNotFoundException;
import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MonumentController {

    @Autowired
    private MonumentService monumentService;

    @PostMapping("/api/monument")
    public Monument createMonument(Monument monument) {
        this.monumentService.insert(monument);
        return monument;
    }

    @GetMapping("/api/monument/{id}")
    public Monument getMonument(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        Monument monument = this.monumentService.get(id);

        if (monument == null) {
            throw new ResourceNotFoundException();
        }

        return monument;
    }

    @GetMapping("/api/monuments")
    public List<Monument> getAllMonuments() {
        return this.monumentService.getAll();
    }

    @PutMapping("/api/monument/{id}")
    public Monument updateMonument(@PathVariable("id") Integer id, Monument monument) {
        this.monumentService.update(monument);
        return monument;
    }
}
