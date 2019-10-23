package com.monumental.services;

import com.monumental.models.Monument;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Root;
import java.util.List;

@Service
public class MonumentService extends ModelService<Monument> {

    public MonumentService(SessionFactoryService sessionFactoryService) {
        super(sessionFactoryService);
    }

    private void buildFTSQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery) {
        query.where(
            builder.or(
                builder.equal(builder.function("fts", Boolean.class, root.get("title"), builder.literal(searchQuery)), true),
                builder.equal(builder.function("fts", Boolean.class, root.get("artist"), builder.literal(searchQuery)), true)
            )
        );
    }

    /**
     * Uses the FTS function to search for matching Monuments
     */
    @SuppressWarnings("unchecked")
    public List<Monument> search(String searchQuery, String page, String limit) {

        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        root.fetch("tags", JoinType.LEFT);
        query.select(root).distinct(true);

        // TODO: Query for tags

        if (searchQuery != null) {
            this.buildFTSQuery(builder, query, root, searchQuery);
        }

        List<Monument> monuments = this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1);

        return monuments;
    }

    /**
     * Count the total number of results for a FTS search
     */
    public Integer countSearchResults(String searchQuery) {

        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Monument> root = query.from(Monument.class);
        query.select(builder.countDistinct(root)).distinct(true);

        this.buildFTSQuery(builder, query, root, searchQuery);

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
    }
}
