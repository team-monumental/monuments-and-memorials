package com.monumental.services;

import com.monumental.models.Reference;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReferenceService extends ModelService<Reference> {

    public List<Reference> getByMonumentId(Integer monumentId) {
        return this.getByMonumentId(monumentId, false);
    }

    public List<Reference> getByMonumentId(Integer monumentId, boolean initializeLazyLoadedCollections) {
        return this.getByForeignKey("monument_id", monumentId, initializeLazyLoadedCollections);
    }
}
