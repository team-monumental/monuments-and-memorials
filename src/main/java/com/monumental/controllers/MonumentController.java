package com.monumental.controllers;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.Monument;
import com.monumental.repositories.MonumentRepository;
import com.monumental.services.MonumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class MonumentController {

    @Autowired
    private MonumentRepository monumentRepository;

    @Autowired
    private MonumentService monumentService;

    @PostMapping("/api/monument")
    public Monument createMonument(@RequestBody Monument monument) {
        this.monumentRepository.save(monument);
        return monument;
    }

    @GetMapping("/api/monument/{id}")
    public Monument getMonument(@PathVariable("id") Integer id,
                                @RequestParam(value = "cascade", defaultValue = "false") Boolean cascade)
            throws ResourceNotFoundException {
        Optional<Monument> optional = this.monumentRepository.findById(id);
        if (optional.isEmpty()) throw new ResourceNotFoundException();
        Monument monument = optional.get();

        if (cascade) {
            this.monumentService.initializeAllLazyLoadedCollections(monument);
        }
        return monument;
    }

    @GetMapping("/api/monuments")
    public List<Monument> getAllMonuments() {
        return this.monumentRepository.findAll();
    }

    @PutMapping("/api/monument/{id}")
    public Monument updateMonument(@PathVariable("id") Integer id, @RequestBody Monument monument) {
        monument.setId(id);
        this.monumentRepository.save(monument);
        return monument;
    }

    @GetMapping("/api/monuments/related")
    public List<Monument> getRelatedMonumentsByTags(@RequestParam List<String> tags,
                                                    @RequestParam Integer monumentId,
                                                    @RequestParam(required = false, defaultValue = "10") Integer limit) {
        return this.monumentService.getRelatedMonumentsByTags(tags, monumentId, limit);
    }}
