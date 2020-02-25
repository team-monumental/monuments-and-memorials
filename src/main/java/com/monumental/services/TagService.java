package com.monumental.services;

import com.monumental.models.Monument;
import com.monumental.models.MonumentTag;
import com.monumental.models.Tag;
import com.monumental.repositories.MonumentTagRepository;
import com.monumental.repositories.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

@Service
@Transactional
public class TagService extends ModelService<Tag> {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private MonumentTagRepository monumentTagRepository;

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

    /**
     * Safely create a new tag without duplication
     * This method should be used ANYTIME you wish to associate a Tag with a Monument
     * @param name          The name of the tag to create
     * @param monuments     The list of monuments to associate it with
     * @param isMaterial    Whether or not the tag is a material
     */
    public Tag createTag(String name, List<Monument> monuments, Boolean isMaterial) {
        if (isNullOrEmpty(name) || monuments == null) {
            return null;
        }

        List<Tag> duplicates = this.tagRepository.getAllByNameAndIsMaterial(name, isMaterial);
        Tag tag;
        if (duplicates != null && duplicates.size() > 0) {
            tag = duplicates.get(0);
        } else {
            tag = new Tag();
            tag.setName(name);
            tag.setIsMaterial(isMaterial);
        }

        this.initializeAllLazyLoadedCollections(tag);

        for (Monument monument : monuments) {
            tag.addMonument(monument);
        }

        this.tagRepository.saveAndFlush(tag);
        return tag;
    }

    /**
     * Remove the specified Tag from the specified Monument
     * This method should be used ANYTIME you want to remove an association between a Monument and a Tag
     * @param tag - Tag to remove from the specified Monument
     * @param monument - Monument to remove the specified Tag from
     * @return Tag - The updated Tag with the specified Monument removed
     */
    public Tag removeTagFromMonument(Tag tag, Monument monument) {
        if (tag == null || monument == null) {
            return null;
        }

        this.initializeAllLazyLoadedCollections(tag);

        if (tag.getMonumentTags() != null && tag.getMonumentTags().size() > 0) {
            List<MonumentTag> newMonumentTags = new ArrayList<>();
            for (MonumentTag monumentTag : tag.getMonumentTags()) {
                if (monumentTag.getMonument().getId() != null) {
                    if (monumentTag.getMonument().getId().equals(monument.getId())) {
                        this.monumentTagRepository.delete(monumentTag);
                    }
                    else {
                        newMonumentTags.add(monumentTag);
                    }
                }
            }

            tag.setMonumentTags(new HashSet<>(newMonumentTags));
            tag = this.tagRepository.saveAndFlush(tag);
            return tag;
        }

        return null;
    }
}
