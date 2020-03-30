package com.monumental.services;

import com.google.gson.Gson;
import com.monumental.config.AppConfig;
import com.monumental.controllers.helpers.MonumentAboutPageStatistics;
import com.monumental.exceptions.InvalidZipException;
import com.monumental.models.*;
import com.monumental.repositories.*;
import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import com.monumental.repositories.suggestions.BulkCreateSuggestionRepository;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.util.async.AsyncJob;
import com.monumental.util.csvparsing.*;
import com.monumental.util.search.SearchHelper;
import com.monumental.util.string.StringHelper;
import com.opencsv.CSVReader;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
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
                            SearchHelper.buildSimilarityExpression(builder, root, searchQuery, "title"),
                            SearchHelper.buildSimilarityExpression(builder, root, searchQuery, "artist")
                        ),
                        SearchHelper.buildSimilarityExpression(builder, root, searchQuery, "description")
                    )
                )
            );
        }

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
     */
    private void buildSearchQuery(CriteriaBuilder builder, CriteriaQuery query, Root root, String searchQuery,
                                  Double threshold, Double latitude, Double longitude, Double distance,
                                  List<String> tags, List<String> materials, SortType sortType, Date start, Date end,
                                  Integer decade, boolean onlyActive) {

        List<Predicate> predicates = new ArrayList<>();

        if (onlyActive) {
            predicates.add(builder.equal(root.get("isActive"), builder.literal(true)));
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

        if (latitude != null && longitude != null && distance != null) {
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
        }

        switch (predicates.size()) {
            case 0:
                return;
            case 1:
                query.where(predicates.get(0));
                break;
            default:
                Predicate[] predicatesArray = new Predicate[predicates.size()];
                predicatesArray = predicates.toArray(predicatesArray);
                query.where(builder.and(predicatesArray));
        }
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
     * @return List<Monument> - List of Monument results based on the specified search parameters
     */
    public List<Monument> search(String searchQuery, String page, String limit, Double threshold, Double latitude,
                                 Double longitude, Double distance, List<String> tags, List<String> materials,
                                 SortType sortType, Date start, Date end, Integer decade, boolean onlyActive) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Monument> query = this.createCriteriaQuery(builder, false);
        Root<Monument> root = this.createRoot(query);
        query.select(root);

        this.buildSearchQuery(
            builder, query, root, searchQuery, threshold, latitude, longitude, distance, tags, materials, sortType,
            start, end, decade, onlyActive
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
     * @see MonumentService#search(String, String, String, Double, Double, Double, Double, List, List, SortType, Date, Date, Integer, boolean)
     */
    public Integer countSearchResults(String searchQuery, Double latitude, Double longitude, Double distance,
                                      List<String> tags, List<String> materials, Date start, Date end, Integer decade, boolean onlyActive) {
        CriteriaBuilder builder = this.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<Monument> root = query.from(Monument.class);
        query.select(builder.countDistinct(root));

        this.buildSearchQuery(
            builder, query, root, searchQuery, 0.1, latitude, longitude, distance, tags, materials, SortType.NONE,
            start, end, decade, onlyActive
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

        for (int i = 0; i < createSuggestions.size(); i++) {
            CreateMonumentSuggestion createSuggestion = createSuggestions.get(i);

            // Create Monument
            Monument createdMonument = this.createMonument(createSuggestion);
            monuments.add(createdMonument);

            // Report progress
            if (job != null && i != createSuggestions.size() - 1) {
                // The row number is the index plus 1 for the header row and plus 1 to be 1-based instead of zero-based
                job.setProgress((double) (i + 2) / createSuggestions.size());
            }
        }

        this.monumentRepository.saveAll(monuments);
        if (job != null) job.setProgress(1.0);
        return monuments;
    }

    public void deleteMonument(Integer id) {
        this.monumentTagRepository.deleteAllByMonumentId(id);
        this.monumentRepository.deleteById(id);
    }

    @SuppressWarnings("unchecked")
    private Predicate buildDateRangeQuery(CriteriaBuilder builder, Root root, Date start, Date end) {
        return builder.between(root.get("date"), start, end);
    }

    @SuppressWarnings("unchecked")
    private Predicate buildDecadeQuery(CriteriaBuilder builder, Root root, Integer decade) {
        Date start = new GregorianCalendar(decade, Calendar.JANUARY, 1).getTime();
        Date end = new GregorianCalendar(decade + 9, Calendar.DECEMBER, 31).getTime();
        return builder.between(root.get("date"), start, end);
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

        List<Monument> allMonumentOldestFirst = this.search(null, null, null, 0.1, null, null, null, null, null,
                SortType.OLDEST, null, null, null, true);

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
            List<Tag> allTags = this.tagRepository.findAll();

            if (allTags.size() > 0) {
                int randomTagIndex = random.nextInt(allTags.size());

                Tag randomTag = allTags.get(randomTagIndex);

                statistics.setRandomTagName(randomTag.getName());
                statistics.setNumberOfMonumentsWithRandomTag(this.monumentRepository.getAllByTagId(randomTag.getId()).size());
            }
        }

        if (searchForSpecificMonuments) {
            // Search for the 9/11 Memorial so we can link to it
            List<Monument> nineElevenMemorialSearchResults = this.search("9/11 Memorial", null, null, 0.75, 40.4242,
                    -74.049, 0.5, null, null, SortType.DISTANCE, null, null, null, true);

            // Only take the first result, if there are any results
            if (nineElevenMemorialSearchResults.size() > 0) {
                statistics.setNineElevenMemorialId(nineElevenMemorialSearchResults.get(0).getId());
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
                monumentSuggestion.getArtist(), monumentSuggestion.getDescription(), monumentSuggestion.getInscription(),
                monumentSuggestion.getCity(), monumentSuggestion.getState());

        // Set the Coordinates
        Point point = MonumentService.createMonumentPoint(monumentSuggestion.getLongitude(), monumentSuggestion.getLatitude());

        createdMonument.setCoordinates(point);

        // In the situation where only the address OR coordinates were specified, populate the missing field
        this.populateNewMonumentLocation(createdMonument);

        // Set the Date
        Date date;

        if (!isNullOrEmpty(monumentSuggestion.getDate())) {
            date = MonumentService.createMonumentDateFromJsonDate(monumentSuggestion.getDate());
        }
        else {
            date = MonumentService.createMonumentDate(monumentSuggestion.getYear(), monumentSuggestion.getMonth());
        }

        createdMonument.setDate(date);

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
            images = this.createMonumentImages(monumentSuggestion.getImages(), createdMonument);
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
                updateSuggestion.getNewArtist(), updateSuggestion.getNewDescription(), updateSuggestion.getNewInscription(),
                updateSuggestion.getMonument().getCity(), updateSuggestion.getMonument().getState());

        // Update the Coordinates
        Point point = MonumentService.createMonumentPoint(updateSuggestion.getNewLongitude(), updateSuggestion.getNewLatitude());
        currentMonument.setCoordinates(point);

        // In the situation that the address or coordinates were removed or changed, try to populate them with correct data
        this.populateUpdatedMonumentLocation(currentMonument, oldAddress, oldCoordinates);

        // Update the Date
        Date date;

        if (!isNullOrEmpty(updateSuggestion.getNewDate())) {
            date = MonumentService.createMonumentDateFromJsonDate(updateSuggestion.getNewDate());
        }
        else {
            date = MonumentService.createMonumentDate(updateSuggestion.getNewYear(), updateSuggestion.getNewMonth());
        }

        currentMonument.setDate(date);

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
        if (updateSuggestion.getNewImageUrls() != null && updateSuggestion.getNewImageUrls().size() > 0) {
            List<Image> newImages = this.createMonumentImages(updateSuggestion.getNewImageUrls(), currentMonument);

            // If the Monument does not have any Images, we can just set them
            if (currentMonument.getImages() == null || currentMonument.getImages().size() == 0) {
                currentMonument.setImages(newImages);
            }
            // Otherwise we need them to add them to the List
            else {
                currentMonument.getImages().addAll(newImages);
            }
        }

        // Update the primary Image
        this.updateMonumentPrimaryImage(currentMonument, updateSuggestion.getNewPrimaryImageId());

        // Delete any Images
        this.deleteMonumentImages(currentMonument, updateSuggestion.getDeletedImageIds());

        // If for some reason the primary Image is deleted, default to the first Image
        this.resetMonumentPrimaryImage(currentMonument);

        currentMonument = this.monumentRepository.save(currentMonument);

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
     * Also moves the S3 images with the specified imageUrls into the permanent S3 image folder
     * @param imageUrls - List of Strings for the URLs to use for the Images
     * @param monument - Monument to associate the new Images with
     * @return List<Image> - List of new Images with the specified imageUrls and associated with the specified Monument
     */
    public List<Image> createMonumentImages(List<String> imageUrls, Monument monument) {
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

        for (String imageUrl : imageUrls) {
            if (!isNullOrEmpty(imageUrl)) {
                // Move image to permanent folder
                String permanentImageUrl = AwsS3Service.getObjectKey(imageUrl, false);
                this.awsS3Service.moveObject(AwsS3Service.getObjectKey(imageUrl, true), permanentImageUrl);

                imagesCount++;
                boolean isPrimary = imagesCount == 1;

                Image image = new Image(permanentImageUrl, isPrimary);
                image.setMonument(monument);
                image = this.imageRepository.save(image);
                images.add(image);
            }
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
     * @throws IllegalArgumentException - If the specified title is null or empty
     */
    public void setBasicFieldsOnMonument(Monument monument, String title, String address, String artist,
                                         String description, String inscription, String city, String state) {
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
            for (Integer imageId : deletedImageIds) {
                this.imageRepository.deleteById(imageId);
            }

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
                monument.getImages().get(0).setIsPrimary(true);
                this.imageRepository.save(monument.getImages().get(0));
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
            List<Tag> currentTags = areMaterials ? monument.getMaterials() : monument.getTags();

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
                    this.tagService.removeTagFromMonument(currentTag, monument);
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
            String address = this.googleMapsService.getAddressFromCoordinates(monument.getLat(), monument.getLon());
            if (address != null) {
                monument.setAddress(address);
            }
        }
        // Otherwise if the Monument has no coordinates, do a geocode
        else if (monument.getCoordinates() == null && monument.getAddress() != null) {
            com.google.maps.model.Geometry geometry = this.googleMapsService.getCoordinatesFromAddress(monument.getAddress());
            if (geometry != null) {
                monument.setCoordinates(createMonumentPoint(geometry.location.lng, geometry.location.lat));
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
        String address = this.googleMapsService.getAddressFromCoordinates(newMonument.getLat(), newMonument.getLon());
        if (address != null) {
            newMonument.setAddress(address);
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
        com.google.maps.model.Geometry geometry = this.googleMapsService.getCoordinatesFromAddress(newMonument.getAddress());
        if (geometry != null) {
            newMonument.setCoordinates(createMonumentPoint(geometry.location.lng, geometry.location.lat));
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
                com.google.maps.model.Geometry point = this.googleMapsService.getCoordinatesFromAddress(address);
                if (point == null) {
                    return new ArrayList<>();
                }
                latitude = point.location.lat;
                longitude = point.location.lng;
            }

            if (latitude != null && longitude != null) {
                return this.search(title, "1", "25", 0.9, latitude, longitude, .1, null, null, SortType.DISTANCE, null,
                        null, null, onlyActive);
            }
        }

        return new ArrayList<>();
    }

    /**
     * Parses the specified MonumentBulkValidationResult into a BulkCreateMonumentSuggestion with corresponding
     * CreateMonumentSuggestions
     * @param bulkValidationResult - MonumentBulkValidationResult object to parse
     * @return BulkCreateMonumentSuggestion - BulkCreateMonumentSuggestion created using the specified
     * MonumentBulkValidationResult
     */
    public BulkCreateMonumentSuggestion parseMonumentBulkValidationResult(MonumentBulkValidationResult bulkValidationResult) {
        if (bulkValidationResult == null || bulkValidationResult.getValidResults() == null) {
            return null;
        }

        List<CsvMonumentConverterResult> validResults = new ArrayList<>(bulkValidationResult.getValidResults().values());
        if (validResults.size() == 0) {
            return null;
        }

        List<CreateMonumentSuggestion> createSuggestions = new ArrayList<>();
        BulkCreateMonumentSuggestion bulkCreateSuggestion = new BulkCreateMonumentSuggestion();
        Gson gson = new Gson();

        for (CsvMonumentConverterResult validResult : validResults) {
            CreateMonumentSuggestion createSuggestion = CsvMonumentConverter.parseCsvMonumentConverterResult(validResult, gson);

            // Upload images to temporary S3 folder
            if (validResult.getImageFiles().size() > 0) {
                for (File image : validResult.getImageFiles()) {
                    String imageObjectUrl = this.awsS3Service.storeObject(AwsS3Service.tempFolderName + image.getName(), image);
                    createSuggestion.getImages().add(imageObjectUrl);
                }

                createSuggestion.setImagesJson(gson.toJson(createSuggestion.getImages()));
            }

            createSuggestion.setBulkCreateSuggestion(bulkCreateSuggestion);
            createSuggestion = this.createSuggestionRepository.save(createSuggestion);
            createSuggestions.add(createSuggestion);
        }

        bulkCreateSuggestion.setCreateSuggestions(createSuggestions);
        bulkCreateSuggestion.setFileName(bulkValidationResult.getFileName());
        return this.bulkCreateSuggestionRepository.save(bulkCreateSuggestion);
    }
}
