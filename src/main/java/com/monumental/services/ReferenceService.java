package com.monumental.services;

import com.monumental.models.Reference;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReferenceService extends ModelService<Reference> {

    /**
     * Public constructor for ReferenceService
     * Use when NOT injecting SessionFactoryService via Spring
     * @param sessionFactoryService - instance of SessionFactoryService to use for initialization
     */
    public ReferenceService(SessionFactoryService sessionFactoryService) {
        this.sessionFactoryService = sessionFactoryService;
    }

    /**
     * Public default constructor for ReferenceService
     */
    public ReferenceService() {

    }

    public List<Reference> getByMonumentId(Integer monumentId) {
        return this.getByMonumentId(monumentId, false);
    }

    public List<Reference> getByMonumentId(Integer monumentId, boolean initializeLazyLoadedCollections) {
        return this.getByForeignKey("monument_id", monumentId, initializeLazyLoadedCollections);
    }
}
