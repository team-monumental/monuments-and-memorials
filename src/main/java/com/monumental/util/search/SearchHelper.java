package com.monumental.util.search;

import com.monumental.models.User;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.vividsolutions.jts.geom.Geometry;

import javax.persistence.criteria.*;

/**
 * Class containing static methods useful for building JPA Criteria API queries
 */
public class SearchHelper {

    /**
     * SRID for coordinates
     * Find more info here: https://spatialreference.org/ref/epsg/wgs-84/
     * And here: https://gis.stackexchange.com/questions/131363/choosing-srid-and-what-is-its-meaning
     */
    public static final int coordinateSrid = 4326;

    /**
     * SRID for feet
     * Find more info here: https://epsg.io/2877
     * And here: https://gis.stackexchange.com/questions/131363/choosing-srid-and-what-is-its-meaning
     */
    public static final int feetSrid = 2877;

    /**
     * Build a pg_tgrm similarity function Expression for the given searchQuery and fieldName
     * @param builder - CriteriaBuilder to use to build the similarity Expression
     * @param root - Root to use to build the similarity Expression
     * @param searchQuery - String for the search query to use in the similarity function
     * @param fieldName - String for the field name to query against
     * @return Expression<Number> - Expression representing the pg_tgrm similarity function expression using the
     * specified searchQuery and fieldName
     */
    public static Expression<Number> buildSimilarityExpression(CriteriaBuilder builder, Root root, String searchQuery,
                                                               String fieldName) {
        return builder.function("similarity", Number.class, root.get(fieldName), builder.literal(searchQuery));
    }

    /**
     * Build a Predicate for the specified pg_tgrm similarity expression
     * @param builder - CriteriaBuilder to use to build the similary Predicate
     * @param expression - pg_tgrm similarity Expression to use to build the Predicate
     * @param threshold - The threshold (0-1) to limit the results by. You can learn about this score at: https://www.postgresql.org/docs/9.6/pgtrgm.html
     * @return Predicate - Predicate built using the specified builder and expression
     */
    public static Predicate buildSimilarityPredicate(CriteriaBuilder builder, Expression<Number> expression,
                                                     Double threshold) {
        return builder.gt(expression, threshold);
    }

    /**
     * Create a PostGIS ST_DWithin query using the specified latitude, longitude and distance for a Monument and
     * adds it to the specified CriteriaQuery
     * @param builder - The CriteriaBuilder for the query
     * @param query - The CriteriaQuery for the Predicate
     * @param root - The Root associated with the CriteriaQuery
     * @param latitude - The latitude of the point to compare to
     * @param longitude - The longitude of the point to compare to
     * @param miles - The number of miles from the comparison point to check
     * @param orderByDistance - True to order the results by distance ascending, False otherwise
     * @return Predicate - Predicate built using the specified parameters for a PostGIS ST_DWithin query on the
     * Monument table
     */
    public static Predicate buildMonumentDWithinQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, Double latitude,
                                              Double longitude, Double miles, Boolean orderByDistance) {
        String comparisonPointAsString = "POINT(" + longitude + " " + latitude + ")";
        Double feet = miles * 5280;

        Expression monumentCoordinates = builder.function("ST_Transform", Geometry.class, root.get("coordinates"),
                builder.literal(feetSrid)
        );

        Expression comparisonCoordinates = builder.function("ST_Transform", Geometry.class,
            builder.function("ST_GeometryFromText", Geometry.class,
                builder.literal(comparisonPointAsString),
                builder.literal(coordinateSrid)
            ),
            builder.literal(feetSrid)
        );

        Expression radius = builder.literal(feet);

        if (orderByDistance) {
            query.orderBy(
                builder.asc(
                    builder.function("ST_Distance", Long.class, monumentCoordinates, comparisonCoordinates)
                )
            );
        }

        return builder.equal(
            builder.function("ST_DWithin", Boolean.class, monumentCoordinates, comparisonCoordinates, radius),
            true
        );
    }

    /**
     * Create a PostGIS ST_DWithin query using the specified comparisonLatitude, comparisonLongitude, distance,
     * suggestionLatitude and suggestionLongitude for a MonumentSuggestion and add it to the specified CriteriaQuery
     * @param builder - The CriteriaBuilder for the query
     * @param query - The CriteriaQuery for the Predicate
     * @param root - The Root associated with the CriteriaQuery
     * @param comparisonLatitude - The latitude of the point to compare to
     * @param comparisonLongitude - The longitude of the point to compare to
     * @param miles - The number of miles from the comparison point to check
     * @param suggestionLatitude - The latitude of the
     * @param orderByDistance - True to order the results by distance ascending, False otherwise
     * @return Predicate - Predicate built using the specified parameters for a PostGIS ST_DWithin query on the
     * Monument table
     */
    /*public static Predicate buildSuggestionDWithinQuery(CriteriaBuilder builder, CriteriaQuery query, Root root,
                                                        Double comparisonLatitude, Double comparisonLongitude,
                                                        Double miles, Double suggestionLatitude,
                                                        Double suggestionLongitude, Boolean orderByDistance) {
        String comparisonPointAsString = "POINT(" + longitude + " " + latitude + ")";
        Double feet = miles * 5280;

        Expression monumentCoordinates = builder.function("ST_Transform", Geometry.class, root.get("coordinates"),
                builder.literal(feetSrid)
        );

        Expression comparisonCoordinates = builder.function("ST_Transform", Geometry.class,
                builder.function("ST_GeometryFromText", Geometry.class,
                        builder.literal(comparisonPointAsString),
                        builder.literal(coordinateSrid)
                ),
                builder.literal(feetSrid)
        );

        Expression radius = builder.literal(feet);

        if (orderByDistance) {
            query.orderBy(
                    builder.asc(
                            builder.function("ST_Distance", Long.class, monumentCoordinates, comparisonCoordinates)
                    )
            );
        }

        return builder.equal(
                builder.function("ST_DWithin", Boolean.class, monumentCoordinates, comparisonCoordinates, radius),
                true
        );
    }*/

    /**
     * // TODO: Make generic
     * Uses a sub-query on User to create a filter so that Models with a createdByUser whose email is similar to the
     * specified email are returned
     * @param builder - The CriteriaBuilder to use to help build the CriteriaQuery
     * @param query - The CriteriaQuery to add the searching logic to
     * @param root - The Root to use with the CriteriaQuery
     * @param email - The email query string to search by
     * @param tableName - The name of the table that the filter is being created on
     * i.e. if you want to filter on the Monument class, the tableName would be "monument"
     * @return Predicate - Predicate built using the specified email for a filter on User's email field
     */
    @SuppressWarnings("unchecked")
    private Predicate buildCreatedByEmailQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String email,
                                               String tableName) {
        // Create a Sub-query for the Join
        Subquery userSubQuery = query.subquery(Long.class);
        Root userRoot = userSubQuery.from(User.class);

        // Join from the user table to the specified table
        Join<User, CreateMonumentSuggestion> join = userRoot.join("create_monument_suggestion");

        // Select the Users whose email is similar to the specified email
    }
}
