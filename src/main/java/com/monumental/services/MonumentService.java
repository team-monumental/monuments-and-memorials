package com.monumental.services;

import com.google.gson.Gson;
import com.monumental.config.AppConfig;
import com.monumental.controllers.helpers.MonumentAboutPageStatistics;
import com.monumental.exceptions.InvalidZipException;
import com.monumental.exceptions.UnauthorizedException;
import com.monumental.models.*;
import com.monumental.repositories.*;
import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import com.monumental.repositories.suggestions.BulkCreateSuggestionRepository;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.repositories.suggestions.UpdateSuggestionRepository;
import com.monumental.util.async.AsyncJob;
import com.monumental.util.csvparsing.*;
import com.monumental.util.search.SearchHelper;
import com.monumental.util.string.StringHelper;
import com.opencsv.CSVReader;
import com.rollbar.notifier.Rollbar;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Tuple;
import javax.persistence.criteria.*;
import java.io.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

@Service
public class MonumentService extends ModelService<Monument> {

    @Autowired
    private MonumentRepository monumentRepository;

    @Autowired
    private TagService tagService;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private ReferenceRepository referenceRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private MonumentTagRepository monumentTagRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UpdateSuggestionRepository updateSuggestionRepository;

    @Autowired
    private GoogleMapsService googleMapsService;

    @Autowired
    private AppConfig appConfig;

    @Autowired
    private CreateSuggestionRepository createSuggestionRepository;

    @Autowired
    private BulkCreateSuggestionRepository bulkCreateSuggestionRepository;

    @Autowired
    private ContributionRepository contributionRepository;

    @Autowired
    private AwsS3Service awsS3Service;

    @Autowired
    private Rollbar rollbar;

    @Autowired
    private UserService userService;
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

         /*The formula from the source is count / (len1 + len2 - count), where count is the number of common trigrams
         * and len1 and len2 are the number of trigrams for the strings (How a similarity between 2 strings is computed)
         */

        //This if statement will run if we want to order the results. The CriteriaQuery object that is passed in is NOT
        //used later in this method. However, the call to query.orderBy(...) will changed the order that the resulting
        //monuments are displayed.

        //This ordering can be tweaked by adjusting the following weights. Higher weights will place matches originating
        //from that field higher on the final list
        final int TITLE_MATCH_WEIGHT = 100;
        final int ARTIST_MATCH_WEIGHT = 20;
        final int DESCRIPTION_MATCH_WEIGHT = 1;

        if (orderByResults) {
            query.orderBy(
                builder.desc(
                    builder.sum(
                        builder.sum(
                            builder.prod(SearchHelper.buildSimilarityExpression(builder, root, searchQuery, "title"), TITLE_MATCH_WEIGHT),
                            builder.prod(SearchHelper.buildSimilarityExpression(builder, root, searchQuery, "artist"), ARTIST_MATCH_WEIGHT)
                        ),
                        builder.prod(SearchHelper.buildSimilarityExpression(builder, root, searchQuery, "description"), DESCRIPTION_MATCH_WEIGHT)
                    )
                )
            );
        }

        //During investigation for CMM-60, it was found that while the threshold value is properly passed, it appeared
        //to have no visible effect on the results received until it was set to 1.0. Should be investigated further at a later date
        return builder.or(
            SearchHelper.buildSimilarityPredicate(builder, SearchHelper.buildSimilarityExpression(builder, root, searchQuery, "title"), threshold),
            SearchHelper.buildSimilarityPredicate(builder, SearchHelper.buildSimilarityExpression(builder, root, searchQuery, "artist"), threshold),
            SearchHelper.buildSimilarityPredicate(builder, SearchHelper.buildSimilarityExpression(builder, root, searchQuery, "description"), threshold)
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
                                        Double miles, Boolean orderByDistance) {
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
     * @param tagNames - The list of tag names to filter by
     * @param isMaterial - If true, only materials will be returned. If false, NO materials will be returned
     */
    @SuppressWarnings("unchecked")
    private Predicate buildTagsQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, List<String> tagNames, Boolean isMaterial) {
        // Create a Sub-query for our Joins
        Subquery tagSubQuery = query.subquery(Long.class);
        Root tagRoot = tagSubQuery.from(Tag.class);
        // Join from the tag table to the monument_tag table
        Join<Tag, MonumentTag> monumentTags = tagRoot.join("monumentTags");
        // Then, Join from the monument_tag table to the monument table
        Join<MonumentTag, Monument> monuments = monumentTags.join("monument");

        // Count the number of matching Monuments
        tagSubQuery.select(builder.count(monuments.get("id")));

        // Where their associated Tags' name is one of the filtered names
        // And its isMaterial matches the specified isMaterial
        tagSubQuery.where(
            builder.and(
                builder.equal(root.get("id"), monuments.get("id")),
                builder.and(
                    tagRoot.get("name").in(tagNames),
                    builder.equal(tagRoot.get("isMaterial"), isMaterial)
                )
            )
        );

        if (isMaterial) {
            // For materials, return monuments with at least one matching material, since most monuments
            // will only have one material it wouldn't really be useful to require that they match all the
            // material search terms
            return builder.greaterThan(tagSubQuery, 0);
        } else {
            // Return the monuments who have at least the correct number of matching tags
            // If there are duplicate tags in the database then this logic is flawed, but the Tag model should already be
            // preventing those duplicates
            return builder.greaterThanOrEqualTo(tagSubQuery, tagNames.size());
        }
    }

    /**
     * Creates a search query on various fields of the Monument and adds it to the specified CriteriaQuery
     * @param builder - The CriteriaBuilder to use to help build the CriteriaQuery
     * @param query - The CriteriaQuery to add the searching logic to
     * @param root - The Root to use with the CriteriaQuery
     * @param searchQuery - The String search query that will get passed into the pg_tgrm similarity function
     * @param threshold - The threshold (0-1) to limit the results by in the pg_tgrm similary function.
     *                  You can learn about this score at https://www.postgresql.org/docs/9.6/pgtrgm.html
     * @param latitude - The latitude of the comparison point
     * @param longitude - The longitude of the comparison point
     * @param distance - The distance from the comparison point to search in, units of miles
     * @param tags - List of tag names to search by
     * @param materials - List of material tag names to search by
     * @param sortType - The way in which to sort the results by
     * @param start - The start date to filter monuments by
     * @param end - The end date to filter monuments by
     * @param decade - The decade to filter monuments by
     * @param onlyActive - If true, only active monuments will be searched. If false, both active and inactive will be searched
     * @param hideTemporary - If true, search only permanent monuments. If false, search both temporary and permanent monuments
     */
    private void buildSearchQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery,
                                  Double threshold, Double latitude, Double longitude, Double distance, String state,
                                  List<String> tags, List<String> materials, SortType sortType, Date start, Date end,
                                  Integer decade, boolean onlyActive, Integer activeStart, Integer activeEnd, Boolean hideTemporary) {

        List<Predicate> predicates = new ArrayList<>();

        if (onlyActive) {
            predicates.add(builder.equal(root.get("isActive"), builder.literal(true)));
        }

        if (hideTemporary) {
            predicates.add(builder.or(builder.isFalse(root.get("isTemporary")), builder.isNull(root.get("isTemporary"))));
        }
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
            predicates.add(this.buildSimilarityQuery(builder, query, root, searchQuery, threshold, sortByRelevance));
        }

        if(state != null && distance < 0) {
            predicates.add(builder.equal(root.get("state"), state));
        } else if (latitude != null && longitude != null && distance != null && distance > 0) {
            predicates.add(this.buildDWithinQuery(builder, query, root, latitude, longitude, distance, sortByDistance));
        }

        if (tags != null && tags.size() > 0) {
            predicates.add(this.buildTagsQuery(builder, query, root, tags, false));
        }

        if (materials != null && materials.size() > 0) {
            predicates.add(this.buildTagsQuery(builder, query, root, materials, true));
        }

        if (start != null && end != null) {
            predicates.add(this.buildDateRangeQuery(builder, root, start, end));
        } else if (decade != null) {
            predicates.add(this.buildDecadeQuery(builder, root, decade));
        } else if (activeEnd != null) {
            predicates.add(this.buildActiveDateRangeQuery(builder, root, activeStart, activeEnd));
        }

        SearchHelper.executeQueryWithPredicates(builder, query, predicates);
    }

    /**
     * Generates a search for Monuments based on matching the specified parameters
     * May make use of the pg_trgm similarity or postgis ST_DWithin functions
     * @param searchQuery - The string search query that will get passed into the pg_tgrm similarity function
     * @param page - The page number of Monument results to return
     * @param limit - The maximum number of Monument results to return
     * @param threshold - The threshold (0-1) to limit the results by for th pg_tgrm similarity function
     *                  You can learn about this score at https://www.postgresql.org/docs/9.6/pgtrgm.html
     * @param latitude - The latitude of the comparison point
     * @param longitude - The longitude of the comparison point
     * @param distance - The distance from the comparison point to search in, units of miles
     * @param tags - List of tag names to search by
     * @param materials - List of material tag names to search by
     * @param sortType - The way in which to sort the results by
     * @param start - The start date to filter monuments by
     * @param end - The end date to filter monuments by
     * @param decade - The decade to filter monuments by
     * @param onlyActive - If true, only active monuments will be searched. If false, both active and inactive will be searched
     * @param hideTemporary - If true, search only permanent monuments. If false, search both temporary and permanent monuments
     * @return List<Monument> - List of Monument results based on the specified search parameters
     */
    public List<Monument> search(String searchQuery, String page, String limit, Double threshold, Double latitude,
                                 Double longitude, Double distance, String state, List<String> tags,
                                 List<String> materials, SortType sortType, Date start, Date end, Integer decade,
                                 boolean onlyActive, Integer activeStart, Integer activeEnd, Boolean hideTemporary) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        query.select(root);

        this.buildSearchQuery(
            builder, query, root, searchQuery, threshold, latitude, longitude, distance, state, tags, materials, sortType,
            start, end, decade, onlyActive, activeStart, activeEnd, hideTemporary
        );

        List<Monument> monuments = limit != null
            ? page != null
                ? this.getWithCriteriaQuery(query, Integer.parseInt(limit), (Integer.parseInt(page)) - 1)
                : this.getWithCriteriaQuery(query, Integer.parseInt(limit))
            : this.getWithCriteriaQuery(query);
        this.loadLazyLoadedCollections(monuments);
        return monuments;
    }

    /**
     * Count the total number of results for a Monument search
     * @see MonumentService#search(String, String, String, Double, Double, Double, Double, String, List, List, SortType, Date,
     * Date, Integer, boolean, Integer, Integer, Boolean)
     */
    public Integer countSearchResults(String searchQuery, Double latitude, Double longitude, Double distance, String state,
                                      List<String> tags, List<String> materials, Date start, Date end, Integer decade,
                                      boolean onlyActive, Integer activeStart, Integer activeEnd, Boolean hideTemporary) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Monument> root = query.from(Monument.class);
        query.select(builder.countDistinct(root));

        this.buildSearchQuery(
            builder, query, root, searchQuery, 0.1, latitude, longitude, distance, state, tags, materials, SortType.NONE,
            start, end, decade, onlyActive, activeStart, activeEnd, hideTemporary
        );

        return this.getEntityManager().createQuery(query).getSingleResult().intValue();
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
        if (tags == null || monumentId == null || limit == null) {
            return null;
        }

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

        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude, 0));
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

    public List<String[]> readCSV(MultipartFile csv) throws IOException {
        BufferedReader br;
        InputStream is = csv.getInputStream();
        br = new BufferedReader(new InputStreamReader(is));
        return new CSVReader(br).readAll();
    }

    /**
     * Create Monument records from a specified ZipFile containing a CSV file and images
     * @param zipFile - ZipFile representation of the .zip file
     * @return BulkCreateResult - Object containing information about the Bulk Monument Create operation
     * @throws InvalidZipException - If there is not exactly 1 CSV file in the .zip file
     * @throws IOException - If there are any I/O errors while processing the ZipFile
     */
    public List<String[]> readCSVFromZip(ZipFile zipFile) throws InvalidZipException, IOException {
        // Search for CSV files in the .zip file
        // If the number of CSV files found is not exactly 1, error
        int csvFileCount = 0;
        ZipEntry csvEntry = null;
        Enumeration<? extends ZipEntry> zipEntries = zipFile.entries();
        while(zipEntries.hasMoreElements()) {
            ZipEntry zipEntry = zipEntries.nextElement();
            if (zipEntry.getName().contains("__MACOSX")) continue;

            if (CsvFileHelper.isCsvFile(zipEntry.getName())) {
                csvEntry = zipEntry;
                csvFileCount++;
            }
        }

        if (csvFileCount != 1) {
            throw new InvalidZipException("Invalid number of CSV files found in .zip: " + csvFileCount);
        }

        // Get the contents as CSV rows from the CSV file
        return ZipFileHelper.readEntireCsvFileFromZipEntry(zipFile, csvEntry);
    }

    /**
     * Create Monument records from the specified List of CSV Strings
     * @param csvFileName - String for the filename of the CSV file
     * @param csvList - List of Strings containing the CSV rows to use to create the new Monuments
     * @param mapping - Map of the CSV file's fields to our fields
     * @param zipFile - ZipFile containing the image files to use for image pre-processing
     * @return BulkCreateResult - Object containing information about the Bulk Monument Create operation
     */
    public MonumentBulkValidationResult validateMonumentCSV(String csvFileName, List<String[]> csvList,
                                                            Map<String, String> mapping, ZipFile zipFile) throws IOException {
        if (csvList == null || mapping == null) {
            return null;
        }

        MonumentBulkValidationResult monumentBulkValidationResult = new MonumentBulkValidationResult();

        List<CsvMonumentConverterResult> results = CsvMonumentConverter.convertCsvRows(csvList, mapping, zipFile);
        for (int i = 0; i < results.size(); i++) {
            CsvMonumentConverterResult result = results.get(i);

            List<Monument> duplicates = this.findDuplicateMonuments(result.getMonumentSuggestion().getTitle(),
                    result.getMonumentSuggestion().getLatitude(), result.getMonumentSuggestion().getLongitude(),
                    result.getMonumentSuggestion().getAddress(), false);

            if (duplicates.size() > 0) {
                StringBuilder warning = new StringBuilder("Potential duplicate records detected for this row:\n");

                for (Monument duplicate : duplicates) {
                    String url = this.appConfig.publicUrl + "/monuments/" + duplicate.getId();
                    warning.append("<a href=").append(url).append(">").append(url).append("</a>\n");
                }

                result.getWarnings().add(warning.toString());
            }

            monumentBulkValidationResult.getResults().put(i + 1, result);
        }

        if (zipFile != null) {
            zipFile.close();
        }

        monumentBulkValidationResult.setFileName(csvFileName);

        return monumentBulkValidationResult;
    }

    /**
     * SYNCHRONOUSLY bulk create monuments from CSV. Since this method is synchronous, long CSVs could take
     * a significant amount of time to process and hold up the thread or HTTP request.
     * This method is intended mainly for use within MonumentServiceIntegrationTest so that the bulk create behavior
     * can be tested synchronously
     * @param bulkCreateMonumentSuggestion - BulkCreateMonumentSuggestion to use to bulk create Monuments
     * @return - List of inserted monuments
     */
    public List<Monument> bulkCreateMonumentsSync(BulkCreateMonumentSuggestion bulkCreateMonumentSuggestion) {
        return this.bulkCreateMonuments(bulkCreateMonumentSuggestion, null);
    }

    /**
     * ASYNCHRONOUSLY bulk create monuments from CSV. This is meant to be wrapped by the AsyncJob in the job param.
     * @param bulkCreateMonumentSuggestion - BulkCreateMonumentSuggestion to use to bulk create Monuments
     * @param job - The AsyncJob to report progress to
     * @return - CompletableFuture of List of inserted monuments
     */
    @Async
    public CompletableFuture<List<Monument>> bulkCreateMonumentsAsync(BulkCreateMonumentSuggestion bulkCreateMonumentSuggestion,
                                                                      AsyncJob job) {
        return CompletableFuture.completedFuture(this.bulkCreateMonuments(bulkCreateMonumentSuggestion, job));
    }

    /**
     * Bulk create monuments from CSV. If job is not null, progress will be reported as the monuments are created.
     * This method should only be called through MonumentService.bulkCreateMonumentsSync or
     * AsyncMonumentService.bulkCreateMonumentsAsync
     * @param bulkCreateSuggestion - BulkCreateMonumentSuggestion to use to bulk create Monuments
     * @param job - The AsyncJob to report progress to
     * @return - List of inserted monuments
     */
    private List<Monument> bulkCreateMonuments(BulkCreateMonumentSuggestion bulkCreateSuggestion, AsyncJob job) {
        if (bulkCreateSuggestion == null || bulkCreateSuggestion.getCreateSuggestions() == null ||
                !bulkCreateSuggestion.getIsApproved()) {
            return null;
        }

        List<Monument> monuments = new ArrayList<>();
        List<CreateMonumentSuggestion> createSuggestions = bulkCreateSuggestion.getCreateSuggestions();
        Set<String> contributor = new HashSet<>();
        for (int i = 0; i < createSuggestions.size(); i++) {
            CreateMonumentSuggestion createSuggestion = createSuggestions.get(i);

            // Create Monument
            Monument createdMonument = this.createMonument(createSuggestion);
            if (job != null) createdMonument.setCreatedBy(job.getUser());
            monuments.add(createdMonument);

            // Report progress
            if (job != null && i != createSuggestions.size() - 1) {
                // The row number is the index plus 1 for the header row and plus 1 to be 1-based instead of zero-based
                job.setProgress((double) (i + 2) / createSuggestions.size());
            }


            for (CreateMonumentSuggestion suggestion : createSuggestions){
                contributor.addAll(suggestion.getContributions());
            }
        }

        this.monumentRepository.saveAll(monuments);
        if (job != null) job.setProgress(1.0);

        rollbar.info("Bulk created " + monuments.size() + " monuments by contributor(s): "+contributor);

        return monuments;
    }

    public void deleteMonument(Integer id) throws UnauthorizedException {
        this.favoriteRepository.deleteAllByMonumentId(id);
        this.updateSuggestionRepository.deleteAllByMonumentId(id);
        this.monumentTagRepository.deleteAllByMonumentId(id);
        this.monumentRepository.deleteById(id);

        rollbar.info("Deleted monument " + id + " by user: " +this.userService.getCurrentUser());
    }

    @SuppressWarnings("unchecked")
    private Predicate buildDateRangeQuery(CriteriaBuilder builder, Root root, Date start, Date end) {
        return builder.between(root.get("date"), start, end);
    }

    @SuppressWarnings("unchecked")
    private Predicate buildDecadeQuery(CriteriaBuilder builder, Root root, Integer decade) {
        if (decade > 0) {
            Date start = new GregorianCalendar(decade, Calendar.JANUARY, 1).getTime();
            Date end = new GregorianCalendar(decade + 9, Calendar.DECEMBER, 31).getTime();
            return builder.between(root.get("date"), start, end);
        }
        else {
            Date end = new GregorianCalendar(1860, Calendar.JANUARY, 31 ).getTime();
            return builder.lessThan(root.get("date"), end);
        }
    }

    @SuppressWarnings("unchecked")
    private Predicate buildActiveDateRangeQuery(CriteriaBuilder builder, Root root, Integer start, Integer end) {
        Date dEnd = new GregorianCalendar(end + 9, Calendar.DECEMBER, 31).getTime();
        Predicate endQuery = builder.lessThanOrEqualTo(root.get("date"), dEnd);
        if (start != null){
            Date dStart = new GregorianCalendar(start, Calendar.JANUARY, 1).getTime();
            return builder.and(builder.or(builder.isNull(root.get("deactivatedDate")),
                    builder.greaterThanOrEqualTo(root.get("deactivatedDate"), dStart)), endQuery);
        }
        else {
            return endQuery;
        }
    }
    /**
     * Gathers the various statistics related to Monuments for the About Page
     * @param searchForSpecificMonuments - True to also include searching for the specific Monuments we display links
     * to on the About Page, such as the 9/11 Memorial, False otherwise. This flag exists mainly to overcome a
     * limitation with H2 (pg_tgrm functions do not work in H2)
     * @return MonumentAboutPageStatistics - Object containing the various statistics relating to Monuments for the
     * About Page
     */
    public MonumentAboutPageStatistics getMonumentAboutPageStatistics(boolean searchForSpecificMonuments) {
        MonumentAboutPageStatistics statistics = new MonumentAboutPageStatistics();

        List<Monument> allMonumentOldestFirst = this.search(null, null, null, 0.1, null, null, null, null, null,null,
                SortType.OLDEST, null, null, null, true, null, null, false);

        List<Object[]> allTagsAndCountsMostUsedFirst = this.tagRepository.getAllOrderByMostUsedDesc();

        // Total number of Monuments
        statistics.setTotalNumberOfMonuments(allMonumentOldestFirst.size());

        // If there are no Monuments then there's no reason to attempt to calculate the other statistics
        if (allMonumentOldestFirst.size() > 0) {
            // Oldest Monument
            if (allMonumentOldestFirst.get(0).getDate() != null) {
                statistics.setOldestMonument(allMonumentOldestFirst.get(0));
            }

            // Newest Monument and Number of Monuments by state
            // Done in the same loop for efficiency
            boolean newestMonumentFound = false;
            HashMap<String, Integer> numberOfMonumentsByState = new HashMap<>();

            for (int i = (allMonumentOldestFirst.size() - 1); i > -1; i--) {
                Monument currentMonument = allMonumentOldestFirst.get(i);

                // Newest Monument
                // Ignore Monuments with null Dates
                if (!newestMonumentFound && currentMonument.getDate() != null) {
                    statistics.setNewestMonument(currentMonument);
                    newestMonumentFound = true;
                }

                // Number of Monuments by state
                String parsedState = StringHelper.parseState(currentMonument.getState());

                if (parsedState != null) {
                    if (!numberOfMonumentsByState.containsKey(parsedState)) {
                        numberOfMonumentsByState.put(parsedState, 1);
                    }
                    else {
                        Integer currentValue = numberOfMonumentsByState.get(parsedState);
                        numberOfMonumentsByState.replace(parsedState, (currentValue + 1));
                    }
                }
            }

            Random random = new Random();

            if (numberOfMonumentsByState.size() > 0) {
                statistics.setNumberOfMonumentsByState(numberOfMonumentsByState);

                // Number of Monuments in random state
                ArrayList<String> statesList = new ArrayList<>(numberOfMonumentsByState.keySet());

                int randomStateIndex = random.nextInt(statesList.size());

                String randomState = statesList.get(randomStateIndex);

                statistics.setRandomState(randomState);
                statistics.setNumberOfMonumentsInRandomState(numberOfMonumentsByState.get(randomState));
            }

            // Number of Monuments with random Tag
            if (allTagsAndCountsMostUsedFirst.size() > 0) {
                int randomTagIndex = random.nextInt(allTagsAndCountsMostUsedFirst.size());

                Tag randomTag = (Tag) allTagsAndCountsMostUsedFirst.get(randomTagIndex)[0];

                statistics.setRandomTagName(randomTag.getName());
                statistics.setNumberOfMonumentsWithRandomTag(this.monumentRepository.getAllByTagId(randomTag.getId()).size());
            }
        }

        // Most popular Tag and Material
        Tag mostPopularTag = null;
        long mostPopularTagCount = 0;

        Tag mostPopularMaterial = null;
        long mostPopularMaterialCount = 0;

        for (Object[] result : allTagsAndCountsMostUsedFirst) {
            Tag resultTag = (Tag) result[0];
            if (resultTag.getIsMaterial() && mostPopularMaterial == null) {
                mostPopularMaterial = resultTag;
                mostPopularMaterialCount = (long) result[1];
            }
            else if (!resultTag.getIsMaterial() && mostPopularTag == null) {
                mostPopularTag = resultTag;
                mostPopularTagCount = (long) result[1];
            }

            if (mostPopularTag != null && mostPopularMaterial != null) {
                break;
            }
        }

        if (mostPopularMaterial != null) {
            statistics.setMostPopularMaterialName(mostPopularMaterial.getName());
            statistics.setMostPopularMaterialUses(Math.toIntExact(mostPopularMaterialCount));
        }

        if (mostPopularTag != null) {
            statistics.setMostPopularTagName(mostPopularTag.getName());
            statistics.setMostPopularTagUses(Math.toIntExact(mostPopularTagCount));
        }


        if (searchForSpecificMonuments) {
            // Search for the 9/11 Memorial so we can link to it
            List<Monument> nineElevenMemorialSearchResults = this.search("9/11 Memorial", null, null, 0.75,
                    40.4242, -74.049, 0.5, null, null,null, SortType.DISTANCE, null, null, null,
                    true, null, null, false);

            // Only take the first result, if there are any results
            if (nineElevenMemorialSearchResults.size() > 0) {
                statistics.setNineElevenMemorialId(nineElevenMemorialSearchResults.get(0).getId());
            }

            // Search for the Vietnam Veterans Memorial so we can link to it
            List<Monument> vietnamVeteransMemorialSearchResults = this.search("Vietnam Veterans Memorial", null, null,
                    0.75, 38.891632, -77.047809, 0.5, null, null,null, SortType.DISTANCE, null,
                    null, null, true, null, null, false);

            // Only take the first result, if there are any results
            if (vietnamVeteransMemorialSearchResults.size() > 0) {
                statistics.setVietnamVeteransMemorialId(vietnamVeteransMemorialSearchResults.get(0).getId());
            }
        }

        return statistics;
    }

    /**
     * Create a new Monument based on the attributes in the specified CreateMonumentSuggestion object
     * @param monumentSuggestion - The CreateMonumentSuggestion object to use to create the new Monument
     * @return Monument - The newly created Monument based on the specified CreateMonumentSuggestion
     */
    public Monument createMonument(CreateMonumentSuggestion monumentSuggestion) {
        if (monumentSuggestion == null || !monumentSuggestion.getIsApproved()) {
            return null;
        }

        Monument createdMonument = new Monument();

        // Is Active
        createdMonument.setIsActive(true);

        // Is Temporary
        createdMonument.setIsTemporary(monumentSuggestion.getIsTemporary());

        // Set basic String fields
        this.setBasicFieldsOnMonument(createdMonument, monumentSuggestion.getTitle(), monumentSuggestion.getAddress(),
                monumentSuggestion.getArtist(), monumentSuggestion.getDescription(),
                monumentSuggestion.getInscription(), monumentSuggestion.getCity(), monumentSuggestion.getState(),
                monumentSuggestion.getDeactivatedComment(), monumentSuggestion.getDateFormat(),
                monumentSuggestion.getDeactivatedDateFormat());

        // Set the Coordinates
        Point point = MonumentService.createMonumentPoint(monumentSuggestion.getLongitude(), monumentSuggestion.getLatitude());

        createdMonument.setCoordinates(point);

        // In the situation where only the address OR coordinates were specified, populate the missing field
        this.populateNewMonumentLocation(createdMonument);

        // Set the date
        Date date;

        if (!isNullOrEmpty(monumentSuggestion.getDate())) {
            date = MonumentService.createMonumentDateFromJsonDate(monumentSuggestion.getDate());
        }
        else {
            date = MonumentService.createMonumentDate(monumentSuggestion.getYear(), monumentSuggestion.getMonth());
        }

        createdMonument.setDate(date);

        // Set the deactivatedDate
        Date deactivatedDate;

        if (!isNullOrEmpty(monumentSuggestion.getDeactivatedDate())) {
            deactivatedDate = MonumentService.createMonumentDateFromJsonDate(monumentSuggestion.getDeactivatedDate());
        }
        else {
            deactivatedDate = MonumentService.createMonumentDate(monumentSuggestion.getDeactivatedYear(), monumentSuggestion.getDeactivatedMonth());
        }

        createdMonument.setDeactivatedDate(deactivatedDate);

        // Save the initial Monument
        createdMonument = this.monumentRepository.save(createdMonument);

        /* Contributions Section */
        List<Contribution> contributions = new ArrayList<>();
        // If the monumentSuggestion has contributions, it means it came from a CSV
        // We always prefer the CSV column for the contributors over the User who created the monumentSuggestion
        if (monumentSuggestion.getContributions() != null && monumentSuggestion.getContributions().size() > 0) {
            contributions = this.createMonumentContributions(monumentSuggestion.getContributions(), createdMonument);
        }
        // If the monumentSuggestion has no contributions, default to the User who created it
        else {
            Contribution contribution = new Contribution();

            contribution.setMonument(createdMonument);
            contribution.setDate(new Date());
            contribution.setSubmittedByUser(monumentSuggestion.getCreatedBy());

            contribution = this.contributionRepository.save(contribution);
            contributions.add(contribution);
        }
        createdMonument.setContributions(contributions);

        /* References Section */
        List<Reference> references = new ArrayList<>();
        if (monumentSuggestion.getReferences() != null && monumentSuggestion.getReferences().size() > 0) {
            references = this.createMonumentReferences(monumentSuggestion.getReferences(), createdMonument);
        }
        createdMonument.setReferences(references);

        /* Images Section */
        List<Image> images = new ArrayList<>();
        if (monumentSuggestion.getImages() != null && monumentSuggestion.getImages().size() > 0) {
            images.addAll(this.createMonumentImages(monumentSuggestion.getImages(),
                    monumentSuggestion.getImageReferenceUrls(), monumentSuggestion.getImageCaptions(), createdMonument, false));
        }
        if (monumentSuggestion.getPhotoSphereImages() != null && monumentSuggestion.getPhotoSphereImages().size() > 0) {
            images.addAll(this.createMonumentImages(monumentSuggestion.getPhotoSphereImages(),
                    monumentSuggestion.getPhotoSphereImageReferenceUrls(), monumentSuggestion.getPhotoSphereImageCaptions(), createdMonument, true));
        }
        createdMonument.setImages(images);

        List<Monument> createdMonumentList = new ArrayList<>();
        createdMonumentList.add(createdMonument);

        /* Materials Section */
        List<Tag> materials = new ArrayList<>();
        if (monumentSuggestion.getMaterials() != null && monumentSuggestion.getMaterials().size() > 0) {
            for (String materialName : monumentSuggestion.getMaterials()) {
                materials.add(this.tagService.createTag(materialName, createdMonumentList, true));
            }
        }

        /* New Materials Section */
        if (monumentSuggestion.getNewMaterials() != null && monumentSuggestion.getNewMaterials().size() > 0) {
            for (String newMaterialName : monumentSuggestion.getNewMaterials()) {
                materials.add(this.tagService.createTag(newMaterialName, createdMonumentList, true));
            }
        }

        createdMonument.setMaterials(materials);

        /* Tags Section */
        List<Tag> tags = new ArrayList<>();
        if (monumentSuggestion.getTags() != null && monumentSuggestion.getTags().size() > 0) {
            for (String tagName : monumentSuggestion.getTags()) {
                tags.add(this.tagService.createTag(tagName, createdMonumentList, false));
            }
        }

        /* New Tags Section */
        if (monumentSuggestion.getNewTags() != null && monumentSuggestion.getNewTags().size() > 0) {
            for (String newTagName : monumentSuggestion.getNewTags()) {
                tags.add(this.tagService.createTag(newTagName, createdMonumentList, false));
            }
        }

        createdMonument.setTags(tags);

        // Save the Monument with the associated References, Images, Materials and Tags
        createdMonument = this.monumentRepository.save(createdMonument);

        // Load the associated Materials and Tags into memory on the new Monument
        createdMonument.setMaterials(this.tagRepository.getAllByMonumentIdAndIsMaterial(createdMonument.getId(), true));
        createdMonument.setTags(this.tagRepository.getAllByMonumentIdAndIsMaterial(createdMonument.getId(), false));

        rollbar.info("Created monument" + createdMonument.getId() + "by: " + createdMonument.getContributions());

        return createdMonument;
    }

    /**
     * Update a Monument using the attributes specified in the UpdateMonumentSuggestion
     * @param updateSuggestion - UpdateMonumentSuggestion object containing the new attributes for the Monument
     * @return Monument - The Monument with the updated attributes
     */
    public Monument updateMonument(UpdateMonumentSuggestion updateSuggestion) {
        if (updateSuggestion == null || !updateSuggestion.getIsApproved()) {
            return null;
        }

        Monument currentMonument = updateSuggestion.getMonument();

        if (currentMonument == null) {
            return null;
        }

        this.initializeAllLazyLoadedCollections(currentMonument);

        // Update isTemporary
        currentMonument.setIsTemporary(updateSuggestion.getNewIsTemporary());

        String oldAddress = currentMonument.getAddress();
        Point oldCoordinates = currentMonument.getCoordinates();

        // Update basic String fields
        this.setBasicFieldsOnMonument(currentMonument, updateSuggestion.getNewTitle(), updateSuggestion.getNewAddress(),
                updateSuggestion.getNewArtist(), updateSuggestion.getNewDescription(),
                updateSuggestion.getNewInscription(), updateSuggestion.getNewCity(), updateSuggestion.getNewState(),
                updateSuggestion.getNewDeactivatedComment(), updateSuggestion.getNewDateFormat(),
                updateSuggestion.getNewDeactivatedDateFormat());

        // Update the Coordinates
        Point point = MonumentService.createMonumentPoint(updateSuggestion.getNewLongitude(), updateSuggestion.getNewLatitude());
        currentMonument.setCoordinates(point);

        // In the situation that the address or coordinates were removed or changed, try to populate them with correct data
        this.populateUpdatedMonumentLocation(currentMonument, oldAddress, oldCoordinates);

        // Update the date
        Date date;

        if (!isNullOrEmpty(updateSuggestion.getNewDate())) {
            date = MonumentService.createMonumentDateFromJsonDate(updateSuggestion.getNewDate());
        }
        else {
            date = MonumentService.createMonumentDate(updateSuggestion.getNewYear(), updateSuggestion.getNewMonth());
        }

        currentMonument.setDate(date);

        // Update the deactivatedDate
        Date deactivatedDate;

        if (!isNullOrEmpty(updateSuggestion.getNewDeactivatedDate())) {
            deactivatedDate = MonumentService.createMonumentDateFromJsonDate(updateSuggestion.getNewDeactivatedDate());
        }
        else {
            deactivatedDate = MonumentService.createMonumentDate(updateSuggestion.getNewDeactivatedYear(), updateSuggestion.getNewDeactivatedMonth());
        }

        currentMonument.setDeactivatedDate(deactivatedDate);

        // Save the current updates
        currentMonument = this.monumentRepository.save(currentMonument);

        /* Contributions section */

        // Add the creator of the updateSuggestion as a contributor for the currentMonument
        Contribution newContribution = new Contribution();

        newContribution.setMonument(currentMonument);
        newContribution.setDate(new Date());
        newContribution.setSubmittedByUser(updateSuggestion.getCreatedBy());

        newContribution = this.contributionRepository.save(newContribution);
        currentMonument.getContributions().add(newContribution);

        /* References section */

        // Update any current Reference URLs
        this.updateMonumentReferences(currentMonument, updateSuggestion.getUpdatedReferenceUrlsById());

        // Add any newly created References
        if (updateSuggestion.getNewReferenceUrls() != null && updateSuggestion.getNewReferenceUrls().size() > 0) {
            List<Reference> newReferences = this.createMonumentReferences(updateSuggestion.getNewReferenceUrls(), currentMonument);

            // If the Monument has no References, we can just set them
            if (currentMonument.getReferences() == null || currentMonument.getReferences().size() == 0) {
                currentMonument.setReferences(newReferences);
            }
            // Otherwise, we need to add them to the current List
            else {
                currentMonument.getReferences().addAll(newReferences);
            }
        }

        // Delete any References
        this.deleteMonumentReferences(currentMonument, updateSuggestion.getDeletedReferenceIds());

        /* Images section */

        // Add any new Images
        List<Image> newImages = new ArrayList<>();
        if (updateSuggestion.getNewImageUrls() != null && updateSuggestion.getNewImageUrls().size() > 0) {
            newImages.addAll(this.createMonumentImages(updateSuggestion.getNewImageUrls(),
                    updateSuggestion.getNewImageReferenceUrls(), updateSuggestion.getNewImageCaptions(), currentMonument, false));
        }
        if (updateSuggestion.getNewPhotoSphereImageUrls() != null &&
                updateSuggestion.getNewPhotoSphereImageUrls().size() > 0) {
            newImages.addAll(this.createMonumentImages(updateSuggestion.getNewPhotoSphereImageUrls(),
                    updateSuggestion.getNewPhotoSphereImageReferenceUrls(), updateSuggestion.getNewPhotoSphereImageCaptions(), currentMonument, true));
        }

        // If the Monument does not have any Images, we can just set them
        if (currentMonument.getImages() == null || currentMonument.getImages().size() == 0) {
            currentMonument.setImages(newImages);
        }
        // Otherwise we need to add them to the List
        else {
            currentMonument.getImages().addAll(newImages);
        }

        // Update image reference URLs and captions
        this.updateImageReferenceUrl(currentMonument, updateSuggestion.getUpdatedImageReferenceUrlsById());
        this.updateImageCaption(currentMonument, updateSuggestion.getUpdatedImageCaptionsById());
        this.updateImageReferenceUrl(currentMonument, updateSuggestion.getUpdatedPhotoSphereImageReferenceUrlsById());
        this.updateImageCaption(currentMonument, updateSuggestion.getUpdatedPhotoSphereImageCaptionsById());

        // Update the primary Image
        this.updateMonumentPrimaryImage(currentMonument, updateSuggestion.getNewPrimaryImageId());

        // Delete any Images
        List<Integer> allImageIdsToDelete = updateSuggestion.getDeletedImageIds();
        if (updateSuggestion.getDeletedPhotoSphereImageIds() != null) {
            allImageIdsToDelete.addAll(updateSuggestion.getDeletedPhotoSphereImageIds());
        }
        this.deleteMonumentImages(currentMonument, allImageIdsToDelete);

        // If for some reason the primary Image is deleted, default to the first Image
        this.resetMonumentPrimaryImage(currentMonument);

        currentMonument = this.monumentRepository.save(currentMonument);

        deleteImagesFromRepository(allImageIdsToDelete);

        /* Materials section */

        // Pull all of the current Materials for the currentMonument into memory
        currentMonument.setMaterials(this.tagRepository.getAllByMonumentIdAndIsMaterial(currentMonument.getId(), true));

        // Update the Materials associated with the Monument
        this.updateMonumentTags(currentMonument, updateSuggestion.getNewMaterials(), true);

        /* Tags section */

        // Pull all of the current Tags for the currentMonument into memory
        currentMonument.setTags(this.tagRepository.getAllByMonumentIdAndIsMaterial(currentMonument.getId(), false));

        // Update the Tags associated with the Monument
        this.updateMonumentTags(currentMonument, updateSuggestion.getNewTags(), false);

        rollbar.info("Updated monument" + currentMonument.getId() + "by: "+currentMonument.getContributions().get(currentMonument.getContributions().size() - 1));

        return currentMonument;
    }

    /**
     * Create Contributions using the specified contributors and associate them with the specified Monument
     * @param contributors - List of Strings for the names of the contributors to use for the Contributions
     * @param monument - Monument to associate the new Contributions with
     * @return List<Contribution> - List of new Contributions with the specified contributors and associated with the
     * specified Monument
     */
    public List<Contribution> createMonumentContributions(List<String> contributors, Monument monument) {
        if (contributors == null || monument == null) {
            return null;
        }

        List<Contribution> contributions = new ArrayList<>();

        for (String contributor : contributors) {
            if (!isNullOrEmpty(contributor)) {
                Contribution contribution = new Contribution();
                contribution.setSubmittedBy(contributor);
                contribution.setDate(new Date());
                contribution.setMonument(monument);

                contribution = this.contributionRepository.save(contribution);

                contributions.add(contribution);
            }
        }

        return contributions;
    }

    public List<Reference> createMonumentReferences(String referenceUrl, Monument monument) {
        if (referenceUrl == null || monument == null) {
            return null;
        }
        ArrayList<String> referenceUrls = new ArrayList<String>();
        referenceUrls.add(referenceUrl);
        return createMonumentReferences(referenceUrls, monument);
    }

    /**
     * Create References using the specified referenceUrls and associate them with the specified Monument
     * @param referenceUrls - List of Strings for the URLs to use for the References
     * @param monument - Monument to associate the new References with
     * @return List<Reference> - List of new References with the specified referenceUrls and associated with the
     * specified Monument
     */
    public List<Reference> createMonumentReferences(List<String> referenceUrls, Monument monument) {
        if (referenceUrls == null || monument == null) {
            return null;
        }

        List<Reference> references = new ArrayList<>();

        for (String referenceUrl : referenceUrls) {
            if (!isNullOrEmpty(referenceUrl)) {
                Reference reference = new Reference(referenceUrl);
                reference.setMonument(monument);

                reference = this.referenceRepository.save(reference);

                references.add(reference);
            }
        }

        return references;
    }

    /**
     * Create Images using the specified imageUrls and associate them with the specified Monument
     * If arePhotoSphereImages is false, also moves the S3 images with the specified imageUrls into the permanent S3
     * image folder
     * @param imageUrls - List of Strings for the URLs to use for the Images
     * @param imageReferenceUrls - List of strings of reference URLs for images
     * @param imageCaptions - List of strings of captions for images
     * @param monument - Monument to associate the new Images with
     * @param arePhotoSphereImages - True if the specified imageUrls are for PhotoSphere images, False otherwise
     * @return List<Image> - List of new Images with the specified imageUrls and associated with the specified Monument
     */
    public List<Image> createMonumentImages(List<String> imageUrls, List<String> imageReferenceUrls, List<String> imageCaptions, Monument monument, boolean arePhotoSphereImages) {
        if (imageUrls == null || monument == null) {
            return null;
        }

        List<Image> images = new ArrayList<>();
        int imagesCount = 0;

        // Find primary Image
        if (monument.getImages() != null && monument.getImages().size() > 0) {
            for (Image image : monument.getImages()) {
                if (image.getIsPrimary()) {
                    imagesCount = monument.getImages().size();
                    break;
                }
            }
        }

        int i = 0;
        for (String imageUrl : imageUrls) {
            if (!isNullOrEmpty(imageUrl)) {
                Image image;

                String imageReferenceUrl = "";
                if (imageReferenceUrls != null && imageReferenceUrls.size() > i) {
                    imageReferenceUrl = imageReferenceUrls.get(i);
                }
                String imageCaption = "";
                if (imageCaptions != null && imageCaptions.size() > i) {
                    imageCaption = imageCaptions.get(i);
                }

                if (!arePhotoSphereImages) {
                    // Move image to permanent folder
                    String objectKey = AwsS3Service.getObjectKey(imageUrl, false);
                    String newKey = this.awsS3Service.moveObject(AwsS3Service.getObjectKey(imageUrl, true), objectKey);
                    String permanentImageUrl = AwsS3Service.getObjectUrl(newKey);

                    imagesCount++;
                    boolean isPrimary = imagesCount == 1;
                    image = new Image(permanentImageUrl, isPrimary, imageReferenceUrl, imageCaption);
                }
                else {
                    image = new Image(imageUrl, false, imageReferenceUrl, imageCaption);
                    image.setIsPhotoSphere(true);
                }

                image.setMonument(monument);
                image = this.imageRepository.save(image);
                images.add(image);
            }
            i++;
        }

        return images;
    }

    /**
     * Sets the basic String fields on a specified Monument to the specified values
     * @param monument - The Monument object to set the fields on
     * @param title - String for the title of the Monument. Cannot be null or empty
     * @param address - String for the address of the Monument
     * @param artist - String for the artist of the Monument
     * @param description - String for the description of the Monument
     * @param inscription - String for the inscription of the Monument
     * @param city - String for the city of the Monument
     * @param state - String for the state of the Monument
     * @param deactivatedComment - String describing why a Monument was deactivated
     * @throws IllegalArgumentException - If the specified title is null or empty
     */
    public void setBasicFieldsOnMonument(Monument monument, String title, String address, String artist,
                                         String description, String inscription, String city, String state,
                                         String deactivatedComment, DateFormat dateFormat,
                                         DateFormat deactivatedDateFormat) {
        if (monument != null) {
            if (isNullOrEmpty(title)) {
                throw new IllegalArgumentException("Monument can not have a null or empty title");
            }

            monument.setTitle(title);
            monument.setAddress(address);
            monument.setArtist(artist);
            monument.setDescription(description);
            monument.setInscription(inscription);
            monument.setCity(city);
            monument.setState(state);
            monument.setDeactivatedComment(deactivatedComment);
            monument.setDateFormat(dateFormat);
            monument.setDeactivatedDateFormat(deactivatedDateFormat);
        }
    }

    /**
     * Update the specified Monument's References to have the new Reference URLs specified
     * @param monument - Monument to update the associated References on
     * @param newReferenceUrlsById - Map of Reference ID to new Reference URL to use for updating
     */
    public void updateMonumentReferences(Monument monument, Map<Integer, String> newReferenceUrlsById) {
        if (monument != null && monument.getReferences() != null && newReferenceUrlsById != null &&
                monument.getReferences().size() > 0 && newReferenceUrlsById.size() > 0) {
            for (Reference currentReference : monument.getReferences()) {
                if (newReferenceUrlsById.containsKey(currentReference.getId())) {
                    currentReference.setUrl(newReferenceUrlsById.get(currentReference.getId()));
                    this.referenceRepository.save(currentReference);
                }
            }
        }
    }

    public void updateImageReferenceUrl(Monument monument, Map<Integer, String> updatedImageReferenceUrlsById) {
        if (monument != null && monument.getImages() != null && updatedImageReferenceUrlsById != null &&
                monument.getImages().size() > 0 && updatedImageReferenceUrlsById.size() > 0) {
            for (Image currentImage : monument.getImages()) {
                if (updatedImageReferenceUrlsById.containsKey(currentImage.getId())) {
                    currentImage.setReferenceUrl(updatedImageReferenceUrlsById.get(currentImage.getId()));
                    this.imageRepository.save(currentImage);
                }
            }
        }
    }

    public void updateImageCaption(Monument monument, Map<Integer, String> updatedImageCaptionsById) {
        if (monument != null && monument.getImages() != null && updatedImageCaptionsById != null &&
                monument.getImages().size() > 0 && updatedImageCaptionsById.size() > 0) {
            for (Image currentImage : monument.getImages()) {
                if (updatedImageCaptionsById.containsKey(currentImage.getId())) {
                    currentImage.setCaption(updatedImageCaptionsById.get(currentImage.getId()));
                    this.imageRepository.save(currentImage);
                }
            }
        }
    }

    /**
     * Delete the specified Monument's References based on the specified IDs
     * @param monument - Monument whose associated References to delete
     * @param deletedReferenceIds - List of Reference IDs to delete and remove from the Monument
     */
    public void deleteMonumentReferences(Monument monument, List<Integer> deletedReferenceIds) {
        if (monument != null && deletedReferenceIds != null && deletedReferenceIds.size() > 0) {
            for (Integer referenceId : deletedReferenceIds) {
                this.referenceRepository.deleteById(referenceId);
            }

            // Since the References may be loaded on the Monument, we need to remove them
            if (monument.getReferences() != null) {
                List<Reference> newReferences = new ArrayList<>();
                for (Reference currentReference : monument.getReferences()) {
                    if (currentReference.getId() != null && !deletedReferenceIds.contains(currentReference.getId())) {
                        newReferences.add(currentReference);
                    }
                }
                monument.setReferences(newReferences);
            }
        }
    }

    /**
     * Updates the specified Monument's primary Image to be the Image with the specified ID
     * @param monument - Monument whose primary Image to update
     * @param newPrimaryImageId - ID of the Image to make the primary Image
     */
    public void updateMonumentPrimaryImage(Monument monument, Integer newPrimaryImageId) {
        if (monument != null && newPrimaryImageId != null) {
            Optional<Image> optionalImage = this.imageRepository.findById(newPrimaryImageId);

            if (optionalImage.isPresent()) {
                Image image = optionalImage.get();
                image.setIsPrimary(true);
                this.imageRepository.save(image);

                // Set all of the other Images to not be the primary
                if (monument.getImages() != null && monument.getImages().size() > 0) {
                    for (Image currentImage : monument.getImages()) {
                        if (currentImage.getId() != null && !currentImage.getId().equals(newPrimaryImageId)) {
                            currentImage.setIsPrimary(false);
                            this.imageRepository.save(currentImage);
                        }
                    }
                }
            }
        }
    }

    /**
     * Delete the specified Monument's Images based on the specified Image IDs
     * @param monument - Monument whose Images are to be deleted
     * @param deletedImageIds - List of IDs of the Images to delete
     */
    public void deleteMonumentImages(Monument monument, List<Integer> deletedImageIds) {
        if (monument != null && deletedImageIds != null && deletedImageIds.size() > 0) {
            // Since the Images may be loaded onto the Monument, we need to remove them before we save
            if (monument.getImages() != null) {
                List<Image> newImages = new ArrayList<>();
                for (Image currentImage : monument.getImages()) {
                    if (currentImage.getId() != null && !deletedImageIds.contains(currentImage.getId())) {
                        newImages.add(currentImage);
                    }
                }
                monument.setImages(newImages);
            }
        }
    }

    /**
     * Delete the specified images from the image repo
     * @param deletedImageIds - List of IDs of the Images to delete
     */
    public void deleteImagesFromRepository(List<Integer> deletedImageIds) {
        if (deletedImageIds != null && deletedImageIds.size() > 0) {
            for (Integer imageId : deletedImageIds) {
                this.imageRepository.deleteById(imageId);
            }
        }
    }

    /**
     * Sets the primary Image for the Monument to the first Image if it doesn't have a primary Image
     * @param monument - Monument to reset the primary Image for
     */
    public void resetMonumentPrimaryImage(Monument monument) {
        if (monument != null && monument.getImages() != null && monument.getImages().size() > 0) {
            boolean primaryImageFound = false;
            for (Image currentImage : monument.getImages()) {
                if (currentImage.getIsPrimary()) {
                    primaryImageFound = true;
                    break;
                }
            }

            if (!primaryImageFound) {
                List<Image> images = monument.getImages();
                for (Image image : images) {
                    // PhotoSphere Images can not be the primary Image
                    if (!image.getIsPhotoSphere()) {
                        image.setIsPrimary(true);
                        this.imageRepository.save(image);
                        break;
                    }
                }
            }
        }
    }

    /**
     * Updates the Tags/Materials associated with the specified Monument to be the Tags/Materials with the specified
     * names
     * Note that any Tags/Materials that were previously associated with the Monument and are NOT in the newTagNames
     * List will be un-associated from the Monument
     * @param monument - Monument to update the associated Tags/Materials for
     * @param newTagNames - List of the new Tag/Material names to associate with the Monument
     * @param areMaterials - True if the newTagNames holds a list of Material names, False otherwise
     */
    public void updateMonumentTags(Monument monument, List<String> newTagNames, boolean areMaterials) {
        if (monument != null && newTagNames != null) {
            List<Monument> monuments = new ArrayList<>();
            monuments.add(monument);


            // Get the names of the current Tags/Materials associated with the Monument
            List<String> currentTagNames = new ArrayList<>();
            List<Tag> currentTags = new ArrayList<>(monument.getMaterials());
            currentTags.addAll(monument.getTags());

            for (Tag currentTag : currentTags) {
                currentTagNames.add(currentTag.getName());
            }

            // Associate any Tags/Materials with the Monument that weren't already associated
            List<Tag> newTags = new ArrayList<>();
            for (String newTagName : newTagNames) {
                if (!currentTagNames.contains(newTagName)) {
                    newTags.add(this.tagService.createTag(newTagName, monuments, areMaterials));
                }
            }

            // Un-associate any Tags/Materials from the Monument that were associated previously and no longer are
            for (Tag currentTag : currentTags) {
                if (!newTagNames.contains(currentTag.getName())) {
                    List<MonumentTag> monumentTags = monument.getMonumentTags().stream().filter(mt -> mt.getTag() == currentTag).collect(Collectors.toList());
                    if (monumentTags.size() > 0) {
                        this.tagService.removeTagFromMonument(monumentTags.get(0), monument);
                    }

                }
                else {
                    newTags.add(currentTag);
                }
            }

            if (areMaterials) {
                monument.setMaterials(newTags);
            }
            else {
                monument.setTags(newTags);
            }
        }
    }

    /**
     * Populates the address or coordinates for the specified Monument, if necessary
     * We always want Monument records to have coordinates and an address
     * @param monument - Monument to populate the location fields for
     */
    public void populateNewMonumentLocation(Monument monument) {
        // If the Monument has no address, do a reverse geocode
        if (monument.getAddress() == null && monument.getCoordinates() != null) {
            GoogleMapsService.AddressBundle bundle = this.googleMapsService.getAddressFromCoordinates(monument.getLat(), monument.getLon());
            if (bundle != null) {
                monument.setAddress(bundle.address);
                monument.setCity(bundle.city);
                monument.setState(bundle.state);
            }
        }
        // Otherwise if the Monument has no coordinates, do a geocode
        else if (monument.getCoordinates() == null && monument.getAddress() != null) {
            GoogleMapsService.AddressBundle bundle = this.googleMapsService.getCoordinatesFromAddress(monument.getAddress());
            if (bundle != null) {
                monument.setCoordinates(createMonumentPoint(bundle.geometry.location.lng, bundle.geometry.location.lat));
                monument.setCity(bundle.city);
                monument.setState(bundle.state);
            }
        }
    }

    /**
     * Populates the address and coordinates field on a Monument being updated, if necessary
     * We always want Monument records to have coordinates and an address
     * @param newMonument - Monument containing the new, updated fields
     * @param oldAddress - String containing the Monument's old address
     * @param oldCoordinates - Point containing the Monument's old coordinates
     */
    public void populateUpdatedMonumentLocation(Monument newMonument, String oldAddress, Point oldCoordinates) {
        this.populateUpdatedMonumentAddress(newMonument, oldAddress, oldCoordinates);
        this.populateUpdatedMonumentCoordinates(newMonument, oldCoordinates, oldAddress);
    }

    /**
     * Cause hibernate to load in the related records
     * @param monuments - The Monuments to force load lazy loaded collections on
     */
    public void loadLazyLoadedCollections(List<Monument> monuments) {
        for (Monument monument : monuments) {
            this.loadLazyLoadedCollections(monument);
        }
    }

    /**
     * Cause hibernate to load in the related records
     * @param monument - The Monument to force load lazy loaded collections on
     */
    @SuppressWarnings("ResultOfMethodCallIgnored")
    public void loadLazyLoadedCollections(Monument monument) {
        monument.getTags();
        monument.getMaterials();
        monument.getImages().size();
    }

    /**
     * Populates the address field on a Monument being updated, if necessary
     * @param newMonument - Monument containing the new, updated fields
     * @param oldAddress - String containing the Monument's old address
     * @param oldCoordinates - Point containing the Monument's old coordinates
     */
    private void populateUpdatedMonumentAddress(Monument newMonument, String oldAddress, Point oldCoordinates) {
        // If the new Monument has an address, no need to reverse geocode
        if (newMonument.getAddress() != null) {
            return;
        }

        // If the new Monument has no coordinates, we can't reverse geocode
        if (newMonument.getCoordinates() == null) {
            return;
        }

        // If the coordinates match, set the address on the new Monument
        if (oldCoordinates != null && newMonument.getCoordinates().equals(oldCoordinates)) {
            newMonument.setAddress(oldAddress);
            return;
        }

        // Perform reverse geocoding
        GoogleMapsService.AddressBundle bundle = this.googleMapsService.getAddressFromCoordinates(newMonument.getLat(), newMonument.getLon());
        if (bundle != null) {
            newMonument.setAddress(bundle.address);
            newMonument.setCity(bundle.city);
            newMonument.setState(bundle.state);
        }
    }

    /**
     * Populates the coordinates field on a Monument being updated, if necessary
     * We always want Monument records to have coordinates and an address
     * @param newMonument - Monument containing the new, updated fields
     * @param oldCoordinates - Point containing the Monument's old coordinates
     * @param oldAddress - String containing the Monument's old address
     */
    private void populateUpdatedMonumentCoordinates(Monument newMonument, Point oldCoordinates, String oldAddress) {
        // If the new Monument has coordinates, no need to geocode
        if (newMonument.getCoordinates() != null) {
            return;
        }

        // If the new Monument has no address, we can't geocode
        if (newMonument.getAddress() == null) {
            return;
        }

        // If the addresses match, set the coordinates on the new record
        if (newMonument.getAddress().equals(oldAddress)) {
            newMonument.setCoordinates(oldCoordinates);
            return;
        }

        // Perform geocode
        GoogleMapsService.AddressBundle bundle = this.googleMapsService.getCoordinatesFromAddress(newMonument.getAddress());
        if (bundle != null) {
            newMonument.setCoordinates(createMonumentPoint(bundle.geometry.location.lng, bundle.geometry.location.lat));
            newMonument.setCity(bundle.city);
            newMonument.setState(bundle.state);
        }
    }

    /**
     * Search for any potential "duplicate" Monuments given a title and coordinates or address
     * A "duplicate" Monument is defined as one that is within .1 of a mile
     * AND has a similar name
     * If no coordinates are specified but an address is, it will be reverse-geocoded into coordinates to compare
     * against
     * @param title - Title of the Monument to search against
     * @param latitude - Latitude of the Monument to search against
     * @param longitude - Longitude of the Monument to search against
     * @param address - Address of the Monument to search against
     * @param onlyActive - If true, only active monuments will be searched. If false, both inactive and active will be searched
     * @return List<Monument> - List of potential duplicate Monuments given the specified title and coordinates
     */
    public List<Monument> findDuplicateMonuments(String title, Double latitude, Double longitude, String address, Boolean onlyActive) {
        if (title != null) {
            if ((latitude == null || longitude == null) && address != null) {
                GoogleMapsService.AddressBundle bundle = this.googleMapsService.getCoordinatesFromAddress(address);
                if (bundle.geometry == null) {
                    return new ArrayList<>();
                }
                latitude = bundle.geometry.location.lat;
                longitude = bundle.geometry.location.lng;
            }

            if (latitude != null && longitude != null) {
                return this.search(title, "1", "25", 0.9, latitude, longitude, .1, null, null, null, SortType.DISTANCE, null,
                        null, null, onlyActive, null, null, false);
            }
        }

        return new ArrayList<>();
    }

    /**
     * SYNCHRONOUSLY parse the specified MonumentBulkValidationResult into a BulkCreateMonumentSuggestion with
     * corresponding CreateMonumentSuggestions
     * Since this method is synchronous, large MonumentBulkValidationResults could take a significant amount of time to
     * process and hold up the thread or HTTP request
     * This method is intended mainly for using with MonumentServiceMockIntegrationTests so that this behavior can be
     * tested synchronously
     * @param bulkValidationResult - MonumentBulkValidationResult object to parse
     * @return BulkCreateMonumentSuggestion - BulkCreateMonumentSuggestion created using the specified
     * MonumentBulkValidationResult
     */
    public BulkCreateMonumentSuggestion parseMonumentBulkValidationResultSync(MonumentBulkValidationResult bulkValidationResult) {
        return this.parseMonumentBulkValidationResult(bulkValidationResult, null);
    }

    /**
     * ASYNCHRONOUSLY parse the specified MonumentBulkValidationResult into a BulkCreateMonumentSuggestion with
     * corresponding CreateMonumentSuggestions
     * This is meant to be wrapped by the AsyncJob in the job param
     * @param bulkValidationResult - MonumentBulkValidationResult object to parse
     * @param job - AsyncJob to report progress to
     * @return - CompletableFuture of BulkCreateMonumentSuggestion created using the specified
     * MonumentBulkValidationResult
     */
    @Async
    public CompletableFuture<BulkCreateMonumentSuggestion> parseMonumentBulkValidationResultAsync(MonumentBulkValidationResult bulkValidationResult,
                                                                                                  AsyncJob job) {
        return CompletableFuture.completedFuture(this.parseMonumentBulkValidationResult(bulkValidationResult, job));
    }

    /**
     * Parses the specified MonumentBulkValidationResult into a BulkCreateMonumentSuggestion with corresponding
     * CreateMonumentSuggestions
     * If job is not null, progress will be reported as CreateMonumentSuggestions are created
     * This method should only be called through MonumentService.parseMonumentBulkValidationResultSync or
     * MonumentService.parseMonumentBulkValidationResultAsync
     * @param bulkValidationResult - MonumentBulkValidationResult object to parse
     * @param job - AsyncJob to report progress to
     * @return BulkCreateMonumentSuggestion - BulkCreateMonumentSuggestion created using the specified
     * MonumentBulkValidationResult
     */
    private BulkCreateMonumentSuggestion parseMonumentBulkValidationResult(MonumentBulkValidationResult bulkValidationResult,
                                                                           AsyncJob job) {
        if (bulkValidationResult == null || bulkValidationResult.getValidResults() == null) {
            return null;
        }

        List<CsvMonumentConverterResult> validResults = new ArrayList<>(bulkValidationResult.getValidResults().values());
        if (validResults.size() == 0) {
            return null;
        }

        List<CreateMonumentSuggestion> createSuggestions = new ArrayList<>();
        BulkCreateMonumentSuggestion bulkCreateSuggestion = this.bulkCreateSuggestionRepository.save(new BulkCreateMonumentSuggestion());
        Gson gson = new Gson();

        for (int i = 0; i < validResults.size(); i++) {
            CsvMonumentConverterResult validResult = validResults.get(i);
            CreateMonumentSuggestion createSuggestion = CsvMonumentConverter.parseCsvMonumentConverterResult(validResult, gson);

            // Upload images to temporary S3 folder
            if (validResult.getImageFiles().size() > 0) {
                for (File image : validResult.getImageFiles()) {
                    String imageObjectUrl = this.awsS3Service.storeObject(AwsS3Service.tempFolderName + image.getName(), image);
                    createSuggestion.getImages().add(imageObjectUrl);
                }

                createSuggestion.setImagesJson(gson.toJson(createSuggestion.getImages()));
            }

            if (job != null) createSuggestion.setCreatedBy(job.getUser());
            createSuggestion.setBulkCreateSuggestion(bulkCreateSuggestion);
            createSuggestion = this.createSuggestionRepository.save(createSuggestion);
            createSuggestions.add(createSuggestion);

            // Report progress
            if (job != null && i != validResults.size() - 1) {
                job.setProgress((double) i / createSuggestions.size());
            }
        }

        bulkCreateSuggestion.setCreateSuggestions(createSuggestions);
        bulkCreateSuggestion.setFileName(bulkValidationResult.getFileName());
        if (job != null) {
            job.setProgress(1.0);
            bulkCreateSuggestion.setCreatedBy(job.getUser());
        }

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        Set<String> contributor = new HashSet<>();
        List<String> monuments =  new ArrayList<>();
        for(CsvMonumentConverterResult result : validResults ) {
            errors.addAll(result.getErrors());
            warnings.addAll(result.getWarnings());
            contributor.addAll(result.getContributorNames());
        }
        for(CreateMonumentSuggestion suggestion : createSuggestions){
            monuments.add(suggestion.getTitle());
        }
        if (!errors.isEmpty()){
            rollbar.info("Monument(s) " + monuments + " by contributors: " + contributor +" suggested with" + errors.size() +" error(s).");
        }
        if(!warnings.isEmpty()){
            rollbar.info("Monument(s) " + monuments + " by contributors: " + contributor +" suggested with " + warnings.size() +" warning(s).");
        }

        rollbar.info("New bulk suggestion:  create " + bulkCreateSuggestion.getCreateSuggestions().size() + " monuments.");
        return this.bulkCreateSuggestionRepository.saveAndFlush(bulkCreateSuggestion);
    }
}
