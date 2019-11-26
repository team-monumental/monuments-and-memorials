package com.monumental.controllers;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.models.Tag;
import com.monumental.models.api.CreateMonumentRequest;
import com.monumental.repositories.MonumentRepository;
import com.monumental.services.MonumentService;
import org.hibernate.Hibernate;
import com.monumental.services.TagService;
import com.vividsolutions.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.*;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

@RestController
@Transactional
public class MonumentController {

    @Autowired
    private MonumentRepository monumentRepository;

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private TagService tagService;

    @PostMapping("/api/monument")
    public Monument createMonument(@RequestBody CreateMonumentRequest monumentRequest) {
        System.out.println("Title: " + monumentRequest.getTitle());
        System.out.println("Address: " + monumentRequest.getAddress());
        System.out.println("Latitude: " + monumentRequest.getLatitude());
        System.out.println("Longitude: " + monumentRequest.getLongitude());
        System.out.println("Year: " + monumentRequest.getYear());
        System.out.println("Month: " + monumentRequest.getMonth());
        System.out.println("Date: " + monumentRequest.getDate());
        System.out.println("Artist: " + monumentRequest.getArtist());
        System.out.println("References:");
        for (String reference : monumentRequest.getReferences()) {
            System.out.println("\t" + reference);
        }
        System.out.println("Materials:");
        for (String material : monumentRequest.getMaterials()) {
            System.out.println("\t" + material);
        }
        System.out.println("New Materials:");
        for (String newMaterial : monumentRequest.getNewMaterials()) {
            System.out.println("\t" + newMaterial);
        }
        System.out.println("Tags:");
        for (String tag : monumentRequest.getTags()) {
            System.out.println("\t" + tag);
        }
        System.out.println("New Tags:");
        for (String newTag: monumentRequest.getNewTags()) {
            System.out.println("\t" + newTag);
        }

        Point point = this.monumentService.createMonumentPoint(monumentRequest.getLongitude(),
                monumentRequest.getLongitude());

        Date date = this.monumentService.createMonumentDate(monumentRequest.getYear(), monumentRequest.getMonth(),
                monumentRequest.getDate());

        // Create a new Monument based on the request values
        Monument createdMonument = new Monument(monumentRequest.getTitle(), monumentRequest.getAddress(), point, date,
                monumentRequest.getArtist());
        List<Monument> createdMonumentList = new ArrayList<>();
        createdMonumentList.add(createdMonument);

        List<Reference> references = new ArrayList<>();

        if (monumentRequest.getReferences() != null && monumentRequest.getReferences().size() > 0) {
            for (String referenceUrl : monumentRequest.getReferences()) {
                if (!isNullOrEmpty(referenceUrl)) {
                    Reference reference = new Reference(referenceUrl);
                    references.add(reference);
                    reference.setMonument(createdMonument);
                }
            }

            createdMonument.setReferences(references);
        }

        List<Tag> materials = new ArrayList<>();

        if (monumentRequest.getMaterials() != null && monumentRequest.getMaterials().size() > 0) {
            for (String materialName : monumentRequest.getMaterials()) {
                if (!isNullOrEmpty(materialName)) {
                    Tag material = this.tagService.createTag(materialName, createdMonumentList, true);
                    materials.add(material);
                }
            }
        }
        createdMonument.setMaterials(materials);

        List<Tag> newMaterials = new ArrayList<>();

        if (monumentRequest.getNewMaterials() != null && monumentRequest.getNewMaterials().size() > 0) {
            for (String newMaterialName : monumentRequest.getNewMaterials()) {
                if (!isNullOrEmpty(newMaterialName)) {
                    Tag newMaterial = this.tagService.createTag(newMaterialName, createdMonumentList, true);
                    newMaterials.add(newMaterial);
                }
            }
        }
        createdMonument.getMaterials().addAll(newMaterials);

        List<Tag> tags = new ArrayList<>();

        if (monumentRequest.getTags)

        //this.monumentRepository.save(monument);
        return null;
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
        List<Monument> monuments = this.monumentService.getRelatedMonumentsByTags(tags, monumentId, limit);
        for (Monument monument : monuments) {
            Hibernate.initialize(monument.getImages());
        }
        return monuments;
    }}
