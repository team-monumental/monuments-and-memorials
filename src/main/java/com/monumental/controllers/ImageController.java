package com.monumental.controllers;

import com.monumental.security.Authorization;
import com.monumental.services.AwsS3Service;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ImageController {

    /**
     * Upload received files to the AWS S3 bucket
     * @param images List of image files to be uploaded to the S3 bucket
     * @return
     */
    @PostMapping("/api/images/upload")
    @PreAuthorize(Authorization.isResearcherOrAbove)
    public String[] storeUploadedImages(@RequestParam("images") MultipartFile[] images,
                                        @RequestParam("isTemp") Boolean isTemp) {
        String[] objectUrls = new String[images.length];
        for (int i = 0; i < images.length; i++) {
            objectUrls[i] = AwsS3Service.storeObject(images[i], isTemp);
        }
        return objectUrls;
    }
}
