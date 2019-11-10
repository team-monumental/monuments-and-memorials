package com.monumental.services;

import com.monumental.models.Tag;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
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
    public List<Tag> getByName(String name, boolean initializeLazyLoadedCollections) {
        ArrayList<Criterion> criteria = new ArrayList<>();
        criteria.add(Restrictions.eq("name", name));

        return this.getWithCriteria(criteria, initializeLazyLoadedCollections);
    }

    /**
     * Get all of the Tags matching any of the specified names
     * @param names List of names to match Tags on
     */
    public List<Tag> getByNames(List<String> names) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Tag> query = this.createCriteriaQuery(builder, false);
        Root<Tag> root = this.createRoot(query);
        query.select(root);

        query.where(
            root.get("name").in(names)
        );

        return this.getWithCriteriaQuery(query);
    }

    /**
     * Search for tags by name, allowing for some fuzziness and ordering by how closely they match
     * @param searchQuery The term to search tag names by
     */
    public List<Tag> search(String searchQuery) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Tag> query = this.createCriteriaQuery(builder, false);
        Root<Tag> root = this.createRoot(query);
        query.select(root);

        Expression<Number> similarity = builder.function("similarity", Number.class, root.get("name"), builder.literal(searchQuery));

        query.where(builder.gt(similarity, 0.1));
        query.orderBy(builder.desc(similarity));

        return this.getWithCriteriaQuery(query, 10);
    }
}
