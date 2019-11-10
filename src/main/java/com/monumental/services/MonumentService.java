package com.monumental.services;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.util.string.StringHelper;
import com.vividsolutions.jts.geom.Geometry;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.lang.reflect.InvocationTargetException;
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
    private Predicate buildSimilarityQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery,
                                      Double threshold, Boolean orderByResults) {
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

        return builder.or(
            builder.gt(builder.function("similarity", Number.class, root.get("title"), builder.literal(searchQuery)), threshold),
            builder.gt(builder.function("similarity", Number.class, root.get("artist"), builder.literal(searchQuery)), threshold),
            builder.gt(builder.function("similarity", Number.class, root.get("description"), builder.literal(searchQuery)), threshold)
        );
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
    private Predicate buildDWithinQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, Double latitude,
                                   Double longitude, Integer miles) {
        String comparisonPointAsString = "POINT(" + longitude + " " + latitude + ")";
        Integer feet = miles * 5280;

        return builder.equal(
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
     true);
    }

    /**
     * Uses a sub-query on tags to create a filter on monuments so that only monuments with all the specified
     * tag names are returned
     * @param builder - The CriteriaBuilder to use to help build the CriteriaQuery
     * @param query - The CriteriaQuery to add the searching logic to
     * @param root - The Root to use with the CriteriaQuery
     * @param tags - The list of tag names to filter by
     */
    @SuppressWarnings("unchecked")
    private Predicate buildTagsQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, List<String> tags) {
        // Create a sub-query on the tags table
        Subquery tagQuery = query.subquery(Long.class);
        Root tagRoot = tagQuery.from(Tag.class);
        // Join on the "monuments" ManyToMany relationship of Tags
        Join<Tag, Monument> join = tagRoot.join("monuments");
        // Count the number of matching tags
        tagQuery.select(builder.count(tagRoot.get("id")));
        // Where they are related to the monuments
        // and their name is one of the filtered names
        tagQuery.where(builder.and(
                builder.equal(root.get("id"), join.get("id")),
                tagRoot.get("name").in(tags))
        );
        // Return the monuments who have at least the correct number of matching tags
        // If there are duplicate tags in the database then this logic is flawed, but the Tag model should already be
        // preventing those duplicates
        return builder.greaterThanOrEqualTo(tagQuery, tags.size());
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
     * @param tags - The list of tag names to filter by
     */
    @SuppressWarnings("unchecked")
    private void buildSearchQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery,
                                  Double latitude, Double longitude, Integer distance, List<String> tags,
                                  Boolean orderByResults) {

        List<Predicate> predicates = new ArrayList<>();

        if (!StringHelper.isNullOrEmpty(searchQuery)) {
            predicates.add(this.buildSimilarityQuery(builder, query, root, searchQuery, 0.1, orderByResults));
        }

        if (latitude != null && longitude != null && distance != null) {
            predicates.add(this.buildDWithinQuery(builder, query, root, latitude, longitude, distance));
        }

        if (tags != null && tags.size() > 0) {
            predicates.add(this.buildTagsQuery(builder, query, root, tags));
        }

        switch (predicates.size()) {
            case 0:
                return;
            case 1:
                query.where(predicates.get(0));
            default:
                Predicate[] predicatesArray = new Predicate[predicates.size()];
                predicatesArray = predicates.toArray(predicatesArray);
                query.where(builder.and(predicatesArray));
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
     * @param tags - List of tag names to search by
     * @return List<Monument> - List of Monument results based on the specified search parameters
     */
    @SuppressWarnings("unchecked")
    public List<Monument> search(String searchQuery, String page, String limit, Double latitude, Double longitude,
                                 Integer distance, List<String> tags) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        query.select(root);

        this.buildSearchQuery(builder, query, root, searchQuery, latitude, longitude, distance, tags, true);

        List<Monument> monuments = limit != null
                                        ? page != null
                                            ? this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1)
                                            : this.getWithCriteriaQuery(query, Integer.parseInt(limit))
                                        : this.getWithCriteriaQuery(query);

        this.getRelatedRecords(monuments, "tags");
        this.getRelatedRecords(monuments, "images");
        return monuments;
    }

    /**
     * Count the total number of results for a Monument search
     */
    public Integer countSearchResults(String searchQuery, Double latitude, Double longitude, Integer distance, List<String> tags) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Monument> root = query.from(Monument.class);
        query.select(builder.countDistinct(root));

        this.buildSearchQuery(builder, query, root, searchQuery, latitude, longitude, distance, tags, false);

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
    }

    /**
     * Gets the related records and sets them on the monument objects, using only one extra SQL query
     * @param monuments Monuments to get related records for - these objects are updated directly using the setter
     *                  but no database update is called
     */
    private void getRelatedRecords(List<Monument> monuments, String fieldName) {
        if (monuments.size() == 0) return;
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        query.select(root);
        root.fetch(fieldName, JoinType.LEFT);

        List<Integer> ids = new ArrayList<>();
        for (Monument monument : monuments) {
            ids.add(monument.getId());
        }

        query.where(
                root.get("id").in(ids)
        );

        List<Monument> monumentsWithRecords = this.getWithCriteriaQuery(query);

        String capitalizedFieldName = fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);

        Map<Integer, List> map = new HashMap<>();
        for (Monument monument : monumentsWithRecords) {
            try {
                map.put(monument.getId(), (List) Monument.class.getDeclaredMethod("get" + capitalizedFieldName).invoke(monument));
            } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException e) {
                System.err.println("Invalid field name: " + fieldName);
                System.err.println("Occurred while trying to use getter: get" + capitalizedFieldName);
                e.printStackTrace();
            }
        }

        for (Monument monument : monuments) {
            try {
                Monument.class.getDeclaredMethod("set" + capitalizedFieldName, List.class).invoke(monument, map.get(monument.getId()));
            } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException e) {
                System.err.println("Invalid field name: " + fieldName);
                System.err.println("Occurred while trying to use setter: set" + capitalizedFieldName);
                e.printStackTrace();
            }
        }
    }
}
