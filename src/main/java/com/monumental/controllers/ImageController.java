package com.monumental.controllers;

import com.monumental.models.Image;
import com.monumental.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ImageController {

    @Autowired
    ImageService imageService;

    @GetMapping("/api/images")
    public List<Image> getImages(@RequestParam Integer monumentId) {
        return this.imageService.getByMonumentId(monumentId);
    }
}
