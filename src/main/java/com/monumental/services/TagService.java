package com.monumental.services;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class TagService extends ModelService<Tag> {

    @Autowired
    TagRepository tagRepository;

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
     * @param isMaterial If true, only materials will be returned. If false, NO materials will be returned
     */
    public List<Tag> search(String searchQuery, Boolean isMaterial) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Tag> query = this.createCriteriaQuery(builder, false);
        Root<Tag> root = this.createRoot(query);
        query.select(root);

        Expression<Number> similarity = builder.function("similarity", Number.class, root.get("name"), builder.literal(searchQuery));
        Expression<Number> wordSimilarity = builder.function("word_similarity", Number.class, root.get("name"), builder.literal(searchQuery));

        query.where(
            builder.and(
                builder.gt(wordSimilarity, 0.25),
                builder.equal(root.get("isMaterial"), isMaterial)
            )
        );
        query.orderBy(builder.desc(builder.sum(wordSimilarity, similarity)));

        return this.getWithCriteriaQuery(query, 10);
    }

    @Transactional
    public Tag createTag(String name, List<Monument> monuments, Boolean isMaterial) {
        try {
            List<Tag> duplicates = this.tagRepository.getAllByNameAndIsMaterial(name, isMaterial);
            Tag tag;
            if (duplicates != null && duplicates.size() > 0) {
                tag = duplicates.get(0);
            } else {
                tag = new Tag();
                tag.setName(name);
                tag.setIsMaterial(isMaterial);
            }
            tag.getMonuments().addAll(monuments);
            this.tagRepository.save(tag);
            return tag;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
