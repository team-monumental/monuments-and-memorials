package com.monumental.services;

import com.monumental.models.Monument;
import com.vividsolutions.jts.geom.Geometry;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
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
     * Creates a PostGIS ST_DWithin query on the Monument's point field and adds it to the specified CriteriaQuery
     * @param builder The CriteriaBuilder for the query
     * @param query The CriteriaQuery
     * @param root The Root associated with the CriteriaQuery
     * @param latitude The latitude of the point to compare to
     * @param longitude The longitude of the point to compare to
     * @param miles - The number of miles from the comparison point to check
     */
    private void buildDWithinQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String latitude,
                                   String longitude, Integer miles) {
        String comparisonPointAsString = "POINT(" + longitude + " " + latitude + ")";
        Integer feet = miles * 5280;

        query.where(
                builder.equal(
                        builder.function("ST_DWithin", Boolean.class,
                                builder.function("ST_Transform", Geometry.class, root.get("point"),
                                        builder.literal(2877)
                                ),
                                builder.function("ST_Transform", Geometry.class,
                                        builder.function("ST_GeometryFromText", Geometry.class,
                                                builder.literal(comparisonPointAsString),
                                                builder.literal(4326)
                                        ),
                                        builder.literal(2877)
                                ),
                                builder.literal(feet)
                        ),
                true)
        );
    }

    /**
     * Generates a search for Monuments based on matching the specified parameters
     * May make use of the pg_trgm similarity or ST_DWithin functions
     * @param searchQuery - The string search query that will get passed into the pg_tgrm similarity function
     * @param page - The page number of Monument results to return
     * @param limit - The maximum number of Monument results to return
     * @param latitude - The latitude of the comparison point
     * @param longitude - The longitude of the comparison point
     * @param miles - The number of miles from the comparison point to search in
     * @return List<Monument> - List of Monument results based on the specified search parameters
     */
    @SuppressWarnings("unchecked")
    public List<Monument> search(String searchQuery, String page, String limit, String latitude, String longitude,
                                 String miles) {

        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        root.fetch("tags", JoinType.LEFT);
        query.select(root);

        // TODO: Query for description
        // TODO: Query for tags
        // TODO: Filters

        if (searchQuery != null) {
            this.buildSimilarityQuery(builder, query, root, searchQuery, 0.1, true);
        }

        if (latitude != null && longitude != null && miles != null) {
            this.buildDWithinQuery(builder, query, root, latitude, longitude, Integer.parseInt(miles));
        }

        List<Monument> monuments = this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1);

        return monuments;
    }

    /**
     * Count the total number of results for a Monument search
     * TODO: Be sure to update this whenever the search function changes so that they stay in sync
     */
    public Integer countSearchResults(String searchQuery, String latitude, String longitude, String miles) {

        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Monument> root = query.from(Monument.class);
        query.select(builder.countDistinct(root));

        if (searchQuery != null) {
            this.buildSimilarityQuery(builder, query, root, searchQuery, 0.1, false);
        }

        if (latitude != null && longitude != null && miles != null) {
            this.buildDWithinQuery(builder, query, root, latitude, longitude, Integer.parseInt(miles));
        }

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
    }
}
