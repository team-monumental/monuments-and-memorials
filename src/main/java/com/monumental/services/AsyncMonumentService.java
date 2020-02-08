package com.monumental.services;

import com.amazonaws.SdkClientException;
import com.monumental.models.Image;
import com.monumental.models.Monument;
import com.monumental.repositories.MonumentRepository;
import com.monumental.util.async.AsyncJob;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * This class is the async counterpart to the MonumentService, where any asynchronous tasks
 * should be kept.
 */
@Service
public class AsyncMonumentService extends AsyncService {

    @Autowired
    MonumentRepository monumentRepository;

    @Autowired
    TagService tagService;

    @Autowired
    AwsS3Service s3Service;

    /**
     * Insert validated monument CSV rows and related objects
     * @param job - The AsyncJob to report progress to
     * @param csvResults - The validated CSV rows, converted into monuments
     * @return List of inserted monuments
     */
    @Async
    public CompletableFuture<List<Monument>> bulkCreateMonuments(AsyncJob job, List<CsvMonumentConverterResult> csvResults) {
        List<Monument> monuments = new ArrayList<>();
        for (int i = 0; i < csvResults.size(); i++) {
            CsvMonumentConverterResult result = csvResults.get(i);
            // Insert the Monument
            Monument insertedMonument = monumentRepository.saveAndFlush(result.getMonument());
            monuments.add(insertedMonument);
            // Insert all of the Tags associated with the Monument
            Set<String> tagNames = result.getTagNames();
            if (tagNames != null && tagNames.size() > 0) {
                for (String tagName : tagNames) {
                    this.tagService.createTag(tagName, Collections.singletonList(insertedMonument), false);
                }
            }

            // Insert all of the Materials associated with the Monument
            Set<String> materialNames = result.getMaterialNames();
            if (materialNames != null && materialNames.size() > 0) {
                for (String materialName : materialNames) {
                    this.tagService.createTag(materialName, Collections.singletonList(insertedMonument), true);
                }
            }

            List<File> imageFiles = result.getImageFiles();
            if (imageFiles != null && imageFiles.size() > 0) {
                String tempDirectoryPath = System.getProperty("java.io.tmpdir");
                boolean encounteredS3Exception = false;
                for (int j = 0; i < imageFiles.size(); j++) {
                    File imageFile = imageFiles.get(j);
                    // Upload the File to S3
                    try {
                        String name = imageFile.getName().replace(tempDirectoryPath + "/", "");
                        String objectUrl = this.s3Service.storeObject(
                                AwsS3Service.imageFolderName + name,
                                imageFile
                        );
                        Image image = new Image();
                        image.setUrl(objectUrl);
                        image.setMonument(insertedMonument);
                        image.setIsPrimary(j == 0);
                        insertedMonument.getImages().add(image);
                    } catch (SdkClientException e) {
                        encounteredS3Exception = true;
                    }
                    // Delete the temp File created
                    imageFile.delete();
                }
                if (encounteredS3Exception) {
                    result.getErrors().add("An error occurred while uploading image(s). Try uploading the images again later.");
                }
            }

            // Report progress
            if (i != csvResults.size()) {
                job.setProgress((double) (i + 1) / csvResults.size());
            }
        }
        this.monumentRepository.saveAll(monuments);
        return CompletableFuture.completedFuture(monuments);
    }
}
