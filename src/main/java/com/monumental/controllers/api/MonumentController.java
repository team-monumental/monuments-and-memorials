package com.monumental.controllers.api;

import com.monumental.exceptions.ResourceNotFoundException;
import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
            throw new ResourceNotFoundException("No Monument with id: '" + id + "' found");
        }

        return monument;
    }
}
