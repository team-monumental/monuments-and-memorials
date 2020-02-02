package com.monumental.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.monumental.controllers.helpers.BulkCreateMonumentRequest;
import com.monumental.controllers.helpers.CreateMonumentRequest;
import com.monumental.controllers.helpers.MonumentAboutPageStatistics;
import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.Image;
import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.repositories.MonumentRepository;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import com.monumental.util.csvparsing.BulkCreateResult;
import com.monumental.util.csvparsing.ZipFileHelper;
import com.opencsv.CSVReader;
import com.vividsolutions.jts.geom.Point;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;
import java.util.zip.ZipFile;

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

    /**
     * Create a new Monument based on the specified CreateMonumentRequest
     * @param monumentRequest - CreateMonumentRequest containing the attributes to use to create the Monument
     * @return Monument - The created Monument
     */
    @PostMapping("/api/monument")
    public Monument createMonument(@RequestBody CreateMonumentRequest monumentRequest) {
        Point point = MonumentService.createMonumentPoint(monumentRequest.getLongitude(),
                monumentRequest.getLatitude());

        Date date;

        if (!isNullOrEmpty(monumentRequest.getDate())) {
            date = MonumentService.createMonumentDateFromJsonDate(monumentRequest.getDate());
        }
        else {
            date = MonumentService.createMonumentDate(monumentRequest.getYear(), monumentRequest.getMonth());
        }

        Monument createdMonument = new Monument();
        createdMonument.setArtist(monumentRequest.getArtist());
        createdMonument.setTitle(monumentRequest.getTitle());
        createdMonument.setDate(date);
        createdMonument.setAddress(monumentRequest.getAddress());
        createdMonument.setCoordinates(point);
        createdMonument.setDescription(monumentRequest.getDescription());
        createdMonument.setInscription(monumentRequest.getInscription());

        // Save the initial Monument
        createdMonument = this.monumentRepository.save(createdMonument);

        /* References Section */
        List<Reference> references = new ArrayList<>();
        if (monumentRequest.getReferences() != null && monumentRequest.getReferences().size() > 0) {
            for (String referenceUrl : monumentRequest.getReferences()) {
                if (!isNullOrEmpty(referenceUrl)) {
                    Reference reference = new Reference(referenceUrl);
                    reference.setMonument(createdMonument);
                    references.add(reference);
                }
            }
        }
        createdMonument.setReferences(references);

        /* Images Section */
        List<Image> images = new ArrayList<>();
        int imagesCount = 0;
        if (monumentRequest.getImages() != null && monumentRequest.getImages().size() > 0) {
            for (String imageUrl : monumentRequest.getImages()) {
                if (!isNullOrEmpty(imageUrl)) {
                    imagesCount++;
                    boolean isPrimary = imagesCount == 1;

                    Image image = new Image(imageUrl, isPrimary);
                    image.setMonument(createdMonument);
                    images.add(image);
                }
            }
        }
        createdMonument.setImages(images);

        List<Monument> createdMonumentList = new ArrayList<>();
        createdMonumentList.add(createdMonument);

        /* Materials Section */
        if (monumentRequest.getMaterials() != null && monumentRequest.getMaterials().size() > 0) {
            for (String materialName : monumentRequest.getMaterials()) {
                this.tagService.createTag(materialName, createdMonumentList, true);
            }
        }

        /* New Materials Section */
        if (monumentRequest.getNewMaterials() != null && monumentRequest.getNewMaterials().size() > 0) {
            for (String newMaterialName : monumentRequest.getNewMaterials()) {
                this.tagService.createTag(newMaterialName, createdMonumentList, true);
            }
        }

        /* Tags Section */
        if (monumentRequest.getTags() != null && monumentRequest.getTags().size() > 0) {
            for (String tagName : monumentRequest.getTags()) {
                this.tagService.createTag(tagName, createdMonumentList, false);
            }
        }

        /* New Tags Section */
        if (monumentRequest.getNewTags() != null && monumentRequest.getNewTags().size() > 0) {
            for (String newTagName : monumentRequest.getNewTags()) {
                this.tagService.createTag(newTagName, createdMonumentList, false);
            }
        }

        // Save the Monument with the associated References, Images, Materials and Tags
        createdMonument = this.monumentRepository.save(createdMonument);

        return createdMonument;
    }

    /**
     * Get a Monument with the specified ID, if it exists
     * @param id - ID of the Monument to get
     * @param cascade - If true, loads all of the lazy-loaded collections associated with the Monument
     * @return Monument - The Monument with the specified ID, if it exists
     * @throws ResourceNotFoundException - If a Monument with the specified ID does not exist
     */
    @GetMapping("/api/monument/{id}")
    public Monument getMonument(@PathVariable("id") Integer id,
                                @RequestParam(value = "cascade", defaultValue = "false") Boolean cascade)
            throws ResourceNotFoundException {
        Optional<Monument> optional = this.monumentRepository.findById(id);
        if (optional.isEmpty()) throw new ResourceNotFoundException("The requested Monument or Memorial does not exist");
        Monument monument = optional.get();

        if (cascade) {
            this.monumentService.initializeAllLazyLoadedCollections(monument);
        }
        return monument;
    }

    /**
     * Get all of the Monuments
     * @return List<Monument> - List of all of the Monuments
     */
    @GetMapping("/api/monuments")
    public List<Monument> getAllMonuments() {
        return this.monumentRepository.findAll();
    }

    /**
     * Update an existing Monument with the specified ID to have the specified attributes
     * @param id - ID of the Monument to update
     * @param monument - Monument containing the new attributes for the specified ID
     * @return Monument - The updated Monument
     */
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
            Hibernate.initialize(monument.getMonumentTags());
        }
        return monuments;
    }

    /**
     * Create many Monuments based on the specified CSV file contents
     * @param csvContents - List of Strings, where each String is a CSV row
     * @return BulkCreateResult - Object containing information about the Bulk Monument Create operation
     */
//    @PostMapping("/api/monument/bulk-create")
//    public BulkCreateResult bulkCreateMonuments(@RequestBody List<String> csvContents) {
//        return this.monumentService.bulkCreateMonumentsFromCsv(csvContents, false, null, null);
//    }

    /**
     * Create many Monuments based on the specified .zip or .csv file
     * @param request - Contains the field mapping and the file to process
     * @return BulkCreateResult - Object representing the results of the Bulk Monument Create operation
     * @throws IOException - If any I/O errors occur while processing the .zip or .csv file
     */
    @PostMapping(value = "/api/monument/bulk-create")
    public BulkCreateResult bulkCreateMonumentsWithImages(@ModelAttribute BulkCreateMonumentRequest request) throws IOException {

        String json = new String(request.getMapping().getBytes());
        ObjectMapper mapper = new ObjectMapper();

        @SuppressWarnings("unchecked")
        Map<String, String> mapping = mapper.readValue(json, Map.class);

        if (request.getZip() != null) {
            ZipFile zipFile = ZipFileHelper.convertMultipartFileToZipFile(request.getZip());
            return this.monumentService.bulkCreateMonumentsFromZip(zipFile, mapping);
        } else {
            // TODO: Find the right home for this file parsing
            BufferedReader br;
            try {
                String line;
                InputStream is = request.getCsv().getInputStream();
                br = new BufferedReader(new InputStreamReader(is));
                List<String[]> result = new CSVReader(br).readAll();
                return this.monumentService.bulkCreateMonuments(result, mapping, null);
            } catch (IOException e) {
                System.err.println(e.getMessage());
                // TODO: Handle this correctly
                return new BulkCreateResult();
            }
        }
    }

    /**
     * Get the statistics related to Monuments for the About Page
     * @return MonumentAboutPageStatistics - Object containing the various statistics relating to Monuments for the
     * About Page
     */
    @GetMapping("/api/monument/statistics")
    public MonumentAboutPageStatistics getMonumentAboutPageStatistics() {
        return this.monumentService.getMonumentAboutPageStatistics();
    }
}
