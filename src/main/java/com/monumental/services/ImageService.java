package com.monumental.services;

import com.monumental.models.Image;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService extends ModelService<Image> {

    public List<Image> getByMonumentId(Integer monumentId) {
        return this.getByMonumentId(monumentId, false);
    }

    public List<Image> getByMonumentId(Integer monumentId, boolean initializeLazyLoadedCollections) {
        return this.getByForeignKey("monument_id", monumentId, initializeLazyLoadedCollections);
    }
}
