package com.monumental.services;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.vividsolutions.jts.geom.Geometry;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MonumentService extends ModelService<Monument> {

    // SRID for coordinates
    // Find more info here: https://spatialreference.org/ref/epsg/wgs-84/
    // And here: https://gis.stackexchange.com/questions/131363/choosing-srid-and-what-is-its-meaning
    public static final int coordinateSrid = 4326;

    // SRID for feet
    // Find more info here: https://epsg.io/2877
    // And here: https://gis.stackexchange.com/questions/131363/choosing-srid-and-what-is-its-meaning
    public static final int feetSrid = 2877;

    public MonumentService(SessionFactoryService sessionFactoryService) {
        super(sessionFactoryService);
    }

    /**
     * Builds a similarity query on the Monument's title, artist and description fields, and adds them to your CriteriaQuery
     * @param builder           Your CriteriaBuilder
     * @param query             Your CriteriaQuery
     * @param root              The root associated with your CriteriaQuery
     * @param searchQuery       The string to search the fields for
     * @param threshold         The threshold (0-1) to limit the results by. You can learn about this score at https://www.postgresql.org/docs/9.6/pgtrgm.html
     * @param orderByResults    If true, your results will be ordered by their similarity to the search query
     */
    private void buildSimilarityQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery,
                                      Double threshold, Boolean orderByResults) {
        query.where(
            builder.or(
                builder.gt(builder.function("similarity", Number.class, root.get("title"), builder.literal(searchQuery)), threshold),
                builder.gt(builder.function("similarity", Number.class, root.get("artist"), builder.literal(searchQuery)), threshold),
                builder.gt(builder.function("similarity", Number.class, root.get("description"), builder.literal(searchQuery)), threshold)
            )
        );

        if (orderByResults) {
            query.orderBy(
                builder.desc(
                    builder.sum(
                        builder.sum(
                            builder.function("similarity", Number.class, root.get("title"), builder.literal(searchQuery)),
                            builder.function("similarity", Number.class, root.get("artist"), builder.literal(searchQuery))
                        ),
                        builder.function("similarity", Number.class, root.get("description"), builder.literal(searchQuery))
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
                    builder.function("ST_Transform", Geometry.class, root.get("coordinates"),
                        builder.literal(feetSrid)
                    ),
                    builder.function("ST_Transform", Geometry.class,
                        builder.function("ST_GeometryFromText", Geometry.class,
                            builder.literal(comparisonPointAsString),
                            builder.literal(coordinateSrid)
                        ),
                        builder.literal(feetSrid)
                    ),
                    builder.literal(feet)
                ),
         true)
        );
    }

    /**
     * Creates a search query on various fields of the Monument and adds it to the specified CriteriaQuery
     * @param builder - The CriteriaBuilder to use to help build the CriteriaQuery
     * @param query - The CriteriaQuery to add the searching logic to
     * @param root - The Root to use with the CriteriaQuery
     * @param searchQuery - The String search query that will get passed into the pg_tgrm similarity function
     * @param latitude - The latitude of the comparison point
     * @param longitude - The longitude of the comparison point
     * @param distance - The distance from the comparison point to search in, units of miles
     */
    @SuppressWarnings("unchecked")
    private void buildSearchQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery,
                                  String latitude, String longitude, String distance, Boolean orderByResults) {
        // TODO: Query for tags
        // TODO: Filters
        if (searchQuery != null) {
            this.buildSimilarityQuery(builder, query, root, searchQuery, 0.1, orderByResults);
        }

        if (latitude != null && longitude != null && distance != null) {
            this.buildDWithinQuery(builder, query, root, latitude, longitude, Integer.parseInt(distance));
        }
    }

    /**
     * Generates a search for Monuments based on matching the specified parameters
     * May make use of the pg_trgm similarity or ST_DWithin functions
     * @param searchQuery - The string search query that will get passed into the pg_tgrm similarity function
     * @param page - The page number of Monument results to return
     * @param limit - The maximum number of Monument results to return
     * @param latitude - The latitude of the comparison point
     * @param longitude - The longitude of the comparison point
     * @param distance - The distance from the comparison point to search in, units of miles
     * @return List<Monument> - List of Monument results based on the specified search parameters
     */
    @SuppressWarnings("unchecked")
    public List<Monument> search(String searchQuery, String page, String limit, String latitude, String longitude,
                                 String distance) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        query.select(root);

        this.buildSearchQuery(builder, query, root, searchQuery, latitude, longitude, distance, true);

        List<Monument> monuments = limit != null
                ? page != null
                ? this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1)
                : this.getWithCriteriaQuery(query, Integer.parseInt(limit))
                : this.getWithCriteriaQuery(query);

        this.getRelatedTags(monuments);
        return monuments;
    }

    /**
     * Count the total number of results for a Monument search
     */
    public Integer countSearchResults(String searchQuery, String latitude, String longitude, String distance) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Monument> root = query.from(Monument.class);
        query.select(builder.countDistinct(root));

        this.buildSearchQuery(builder, query, root, searchQuery, latitude, longitude, distance, false);

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
    }

    /**
     * Gets the related monuments and sets them on the monument objects, using only one extra SQL query
     * @param monuments Monuments to get tags for - these objects are updated directly using setTags
     *                  but no database update is called
     */
    public void getRelatedTags(List<Monument> monuments) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        query.select(root);
        root.fetch("tags", JoinType.LEFT);

        List<Integer> ids = new ArrayList<>();
        for (Monument monument : monuments) {
            ids.add(monument.getId());
        }

        query.where(
                root.get("id").in(ids)
        );

        List<Monument> monumentsWithTags = this.getWithCriteriaQuery(query);

        Map<Integer, List<Tag>> tagsMap = new HashMap<>();
        for (Monument monument : monumentsWithTags) {
            tagsMap.put(monument.getId(), monument.getTags());
        }

        for (Monument monument : monuments) {
            monument.setTags(tagsMap.get(monument.getId()));
        }
    }
}
