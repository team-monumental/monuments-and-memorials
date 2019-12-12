package com.monumental.services;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.repositories.MonumentRepository;
import com.monumental.util.csvparsing.BulkCreateResult;
import com.monumental.util.csvparsing.CsvMonumentConverter;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import org.hibernate.exception.ConstraintViolationException;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Service;

import javax.persistence.Tuple;
import javax.persistence.criteria.*;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

@Service
public class MonumentService extends ModelService<Monument> {

    @Autowired
    MonumentRepository monumentRepository;

    @Autowired
    TagService tagService;

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
     * This enum is used when choosing how to sort search results
     */
    public enum SortType {
        RELEVANCE, DISTANCE, NEWEST, OLDEST, NONE;
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
     * @param query The CriteriaQuery being created
     * @param root The Root associated with the CriteriaQuery
     * @param latitude The latitude of the point to compare to
     * @param longitude The longitude of the point to compare to
     * @param miles The number of miles from the comparison point to check
     * @param orderByDistance If true, results will be ordered by distance ascending
     */
    private Predicate buildDWithinQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, Double latitude, Double longitude,
                                        Integer miles, Boolean orderByDistance) {
        String comparisonPointAsString = "POINT(" + longitude + " " + latitude + ")";
        Integer feet = miles * 5280;

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
                    builder.function("ST_Distance", Long.class,
                        monumentCoordinates, comparisonCoordinates
                    )
                )
            );
        }

        return builder.equal(
            builder.function("ST_DWithin", Boolean.class,
                monumentCoordinates, comparisonCoordinates, radius
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
     * @param isMaterial - If true, only materials will be returned. If false, NO materials will be returned
     */
    @SuppressWarnings("unchecked")
    private Predicate buildTagsQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, List<String> tags, Boolean isMaterial) {
        // Create a sub-query on the tags table
        Subquery tagQuery = query.subquery(Long.class);
        Root tagRoot = tagQuery.from(Tag.class);
        // Join on the "monuments" ManyToMany relationship of Tags
        Join<Tag, Monument> join = tagRoot.join("monuments");
        // Count the number of matching tags
        tagQuery.select(builder.count(tagRoot.get("id")));
        // Where they are related to the monuments
        // and their name is one of the filtered names
        tagQuery.where(
            builder.and(
                builder.equal(root.get("id"), join.get("id")),
                builder.and(
                    tagRoot.get("name").in(tags),
                    builder.equal(tagRoot.get("isMaterial"), isMaterial)
                )
            )
        );
        if (isMaterial) {
            // For materials, return monuments with at least one matching material, since most monuments
            // will only have one material it wouldn't really be useful to require that they match all the
            // material search terms
            return builder.greaterThan(tagQuery, 0);
        } else {
            // Return the monuments who have at least the correct number of matching tags
            // If there are duplicate tags in the database then this logic is flawed, but the Tag model should already be
            // preventing those duplicates
            return builder.greaterThanOrEqualTo(tagQuery, tags.size());
        }
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
     * @param tags - List of tag names to search by
     * @param materials - List of material tag names to search by
     * @param sortType - The way in which to sort the results by
     */
    private void buildSearchQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery,
                                  Double latitude, Double longitude, Integer distance, List<String> tags,
                                  List<String> materials, SortType sortType) {

        List<Predicate> predicates = new ArrayList<>();

        boolean sortByRelevance = false;
        boolean sortByDistance = false;

        switch (sortType) {
            case NEWEST:
                this.sortByDate(builder, query, root, true);
                break;
            case OLDEST:
                this.sortByDate(builder, query, root, false);
                break;
            case DISTANCE:
                sortByDistance = true;
                break;
            case RELEVANCE:
                sortByRelevance = true;
                break;
        }

        if (!isNullOrEmpty(searchQuery)) {
            predicates.add(this.buildSimilarityQuery(builder, query, root, searchQuery, 0.1, sortByRelevance));
        }

        if (latitude != null && longitude != null && distance != null) {
            predicates.add(this.buildDWithinQuery(builder, query, root, latitude, longitude, distance, sortByDistance));
        }

        if (tags != null && tags.size() > 0) {
            predicates.add(this.buildTagsQuery(builder, query, root, tags, false));
        }

        if (materials != null && materials.size() > 0) {
            predicates.add(this.buildTagsQuery(builder, query, root, materials, true));
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
     * @param materials - List of material tag names to search by
     * @param sortType - The way in which to sort the results by
     * @return List<Monument> - List of Monument results based on the specified search parameters
     */
    public List<Monument> search(String searchQuery, String page, String limit, Double latitude, Double longitude,
                                 Integer distance, List<String> tags, List<String> materials, SortType sortType) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        query.select(root);

        this.buildSearchQuery(builder, query, root, searchQuery, latitude, longitude, distance, tags, materials, sortType);

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
    public Integer countSearchResults(String searchQuery, Double latitude, Double longitude, Integer distance,
                                      List<String> tags, List<String> materials) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Monument> root = query.from(Monument.class);
        query.select(builder.countDistinct(root));

        this.buildSearchQuery(builder, query, root, searchQuery, latitude, longitude, distance, tags, materials, SortType.NONE);

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

    /**
     * Get up to 10 monuments with the most matching tags/materials
     * @param tags - The list of tag names to match by
     * @param monumentId - The id of the monument that is being searched for related monuments of. It will be excluded
     *                     from results.
     * @param limit - The number of results to return
     * @return List<Monument> - The List of Monuments with matching Tags/Materials, ordered by number matching Tags/Materials
     */
    public List<Monument> getRelatedMonumentsByTags(List<String> tags, Integer monumentId, Integer limit) {
        List<Tuple> results = this.monumentRepository.getRelatedMonuments(tags, monumentId, PageRequest.of(0, limit));
        List<Monument> monuments = new ArrayList<>();
        for (Tuple result : results) {
            monuments.add((Monument) result.get(0));
        }
        return monuments;
    }

    /**
     * Create a Point object for a Monument from the specified longitude and latitude
     * @param longitude - Double for the longitude of the Point
     * @param latitude - Double for the latitude of the Point
     * @return Point - The Point object created using the specified longitude and latitude
     */
    public static Point createMonumentPoint(Double longitude, Double latitude) {
        if (longitude == null || latitude == null) {
            return null;
        }

        GeometryFactory geometryFactory = new GeometryFactory();

        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        point.setSRID(coordinateSrid);

        return point;
    }

    /**
     * Create a Date object for a Monument using the specified year
     * Sets the month to January and the day to the 1st
     * @param year - String for the year to use to create the Date
     *             Must be in "yyyy" format
     * @return Date - Date object created using the specified year
     */
    public static Date createMonumentDate(String year) {
        return MonumentService.createMonumentDate(year, "0", "1");
    }

    /**
     * Create a Date object for a Monument using the specified year and month
     * Sets the day to the 1st
     * @param year - String for the year to use to create the Date
     *             Must be in "yyyy" format
     * @param month - String for the month to use to create the Date
     *              Must be in "MM" format
     * @return Date - Date object created using the specified year and month
     */
    public static Date createMonumentDate(String year, String month) {
        return MonumentService.createMonumentDate(year, month, "1");
    }

    /**
     * Create a Date object for a Monument using the specified year, month and day
     * @param year - String for the year to use to create the Date
     *             Must be in "yyyy" format
     * @param month - String for the month to use to create the Date
     *              Assumed to be zero-based
     *              Must be in "M" format
     * @param day - String for the day to use to create the Date
     *            Must be in "d" format
     * @return Date - Date object created using the specified year, month and day
     */
    public static Date createMonumentDate(String year, String month, String day) {
        if (isNullOrEmpty(year)) {
            return null;
        }

        GregorianCalendar calendar = new GregorianCalendar();
        int yearInt = Integer.parseInt(year);

        int monthInt = 0;
        if (!isNullOrEmpty(month)) {
            monthInt = Integer.parseInt(month);
        }

        int dayInt = 1;
        if (!isNullOrEmpty(day)) {
            dayInt = Integer.parseInt(day);
        }

        calendar.set(yearInt, monthInt, dayInt);

        return calendar.getTime();
    }

    /**
     * Create a Date object for a Monument using a JSON date-string
     * @param jsonDate - String for the JSON date to use to create the Date
     * @return Date - Date object created using the specified JSON date-string
     */
    public static Date createMonumentDateFromJsonDate(String jsonDate) {
        if (isNullOrEmpty(jsonDate)) {
            return null;
        }

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

        try {
            return simpleDateFormat.parse(jsonDate);
        } catch (ParseException e) {
            return null;
        }
    }

    /**
     * Sort the query by the monuments' date field
     * @param builder The CriteriaBuilder for the query
     * @param query The CriteriaQuery being created
     * @param root The Root associated with the CriteriaQuery
     * @param newestFirst If true, the results will be sorted in descending order
     */
    private void sortByDate(CriteriaBuilder builder, CriteriaQuery query, Root root, Boolean newestFirst) {
        query.orderBy(
            newestFirst ?
                builder.desc(root.get("date")) :
                builder.asc(root.get("date"))
        );
    }

    /**
     * Create Monument records from the specified List of CSV Strings
     * @param csvList - List of Strings containing the CSV rows to use to create the new Monuments
     * @return BulkCreateResult - Object containing information about the Bulk Monument Create operation
     */
    public BulkCreateResult bulkCreateMonumentsFromCsv(List<String> csvList) {
        if (csvList == null) {
            return null;
        }

        BulkCreateResult bulkCreateResult = new BulkCreateResult();
        ArrayList<CsvMonumentConverterResult> validResults = new ArrayList<>();
        Integer rowNumber = 0;

        for (String csvRow : csvList) {
            // Increment the rowNumber counter
            rowNumber++;

            try {
                // Convert the row into a CsvMonumentConverterResult object
                CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow.strip());

                // Validate the result
                CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

                if (validationResult.isValid()) {
                    validResults.add(result);
                }
                else {
                    bulkCreateResult.getInvalidCsvMonumentRecordsByRowNumber().put(rowNumber, result.toString());
                    bulkCreateResult.getInvalidCsvMonumentRecordErrorsByRowNumber().put(rowNumber,
                            validationResult.getValidationErrors());
                }
            } catch (Exception e) {
                System.out.println("ERROR processing row number: " + rowNumber);
                System.out.println(e.toString());
            }
        }

        int monumentsInsertedCount = 0;

        for (CsvMonumentConverterResult validResult : validResults) {
            // Insert the Monument
            try {
                System.out.println("Trying to insert Monument");
                Monument insertedMonument = monumentRepository.saveAndFlush(validResult.getMonument());
                bulkCreateResult.getValidMonumentRecords().add(insertedMonument);
            } catch (Exception e) {
                // TODO: Determine how duplicate "monument_tag" (join table) records are being inserted
                // These are disregarded for now - the correct tags are still being created
                e.printStackTrace();
            }
            monumentsInsertedCount++;

            // Insert all of the Tags associated with the Monument
            List<Tag> tags = validResult.getTags();
            if (tags == null) {
                tags = new ArrayList<>();
            }

            List<Tag> materials = validResult.getMaterials();
            if (materials == null) {
                materials = new ArrayList<>();
            }

            tags.addAll(materials);

            if (tags.size() > 0) {
                for (Tag tag : tags) {
                    try {
                        tagService.createTag(tag.getName(), tag.getMonuments(), tag.getIsMaterial());
                    } catch (Exception e) {
                        // TODO: Determine how duplicate "monument_tag" (join table) records are being inserted
                        // These are disregarded for now - the correct tags are still being created
                        e.printStackTrace();
                    }
                }
            }
        }

        bulkCreateResult.setMonumentsInsertedCount(monumentsInsertedCount);

        return bulkCreateResult;
    }
}
