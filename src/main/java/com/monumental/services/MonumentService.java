package com.monumental.services;

import com.monumental.models.Monument;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class MonumentService extends ModelService<Monument> {

    public MonumentService(SessionFactoryService sessionFactoryService) {
        super(sessionFactoryService);
    }

    /**
     * Builds a similarity query on the Monument's title and artist fields, and adds them to your CriteriaQuery
     * @param builder           Your CriteriaBuilder
     * @param query             Your CriteriaQuery
     * @param root              The root associated with your CriteriaQuery
     * @param searchQuery       The string to search both fields for
     * @param threshold         The threshold (0-1) to limit the results by. You can learn about this score at https://www.postgresql.org/docs/9.6/pgtrgm.html
     * @param orderByResults    If true, your results will be ordered by their similarity to the search query
     */
    private void buildSimilarityQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery, Double threshold, Boolean orderByResults) {
        query.where(
            builder.or(
                builder.gt(builder.function("similarity", Number.class, root.get("title"), builder.literal(searchQuery)), threshold),
                builder.gt(builder.function("similarity", Number.class, root.get("artist"), builder.literal(searchQuery)), threshold)
            )
        );

        if (orderByResults) {
            query.orderBy(
                builder.desc(
                    builder.sum(
                        builder.function("similarity", Number.class, root.get("title"), builder.literal(searchQuery)),
                        builder.function("similarity", Number.class, root.get("artist"), builder.literal(searchQuery))
                    )
                )
            );
        }
    }

    /**
     * Uses the FTS function as well as any filtering or pagination provided to search for matching Monuments
     */
    @SuppressWarnings("unchecked")
    public List<Monument> search(String searchQuery, String page, String limit) {

        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        root.fetch("tags", JoinType.LEFT);
        query.select(root);

        // TODO: Query for tags
        // TODO: Query for location
        // TODO: Filters

        if (searchQuery != null) {
            this.buildSimilarityQuery(builder, query, root, searchQuery, 0.1, true);
        }

        return this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1);
    }

    /**
     * Count the total number of results for a FTS search
     * TODO: Be sure to update this whenever the search function changes so that they stay in sync
     */
    public Integer countSearchResults(String searchQuery) {

        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Monument> root = query.from(Monument.class);
        query.select(builder.countDistinct(root));

        this.buildSimilarityQuery(builder, query, root, searchQuery, 0.1, false);

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
    }
}
