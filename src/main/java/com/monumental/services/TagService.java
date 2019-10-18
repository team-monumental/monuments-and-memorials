package com.monumental.services;

import com.monumental.models.Tag;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService extends ModelService<Tag> {

    /**
     * Public constructor for TagService
     * Use when NOT injecting SessionFactoryService via Spring
     * @param sessionFactoryService - instance of SessionFactoryService to use for initialization
     */
    public TagService(SessionFactoryService sessionFactoryService) {
        this.sessionFactoryService = sessionFactoryService;
    }

    /**
     * Public default constructor for TagService
     */
    public TagService() {

    }

    public List<Tag> getByMonumentId(Integer monumentId) {
        return this.getByMonumentId(monumentId, false);
    }

    public List<Tag> getByMonumentId(Integer monumentId, boolean initializeLazyLoadedCollections) {
        return this.getByJoinTable("monuments", "id", monumentId, initializeLazyLoadedCollections);
    }

    /**
     * Get all of the Tags with the specified name
     * @param name - name of the Tag to get as a String
     * @return List<Tag> - List of Tags with the specified name
     */
    public List<Tag> getTagsByName(String name) {
        return this.getFromWhere("name", name);
    }
}
