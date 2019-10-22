package com.monumental.services;

import com.monumental.models.Tag;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TagService extends ModelService<Tag> {

    public TagService(SessionFactoryService sessionFactoryService) {
        super(sessionFactoryService);
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
     * @param initializeLazyLoadedCollections - If true, initializes all of the Monuments associated with the Tags
     * @return List<Tag> - List of Tags with the specified name
     */
    public List<Tag> getTagsByName(String name, boolean initializeLazyLoadedCollections) {
        ArrayList<Criterion> criteria = new ArrayList<>();
        criteria.add(Restrictions.eq("name", name));

        return this.getWithCriteria(criteria, initializeLazyLoadedCollections);
    }
}
