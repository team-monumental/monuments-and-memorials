package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import com.monumental.repositories.ContributionRepository;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.ReferenceRepository;
import com.monumental.repositories.TagRepository;
import com.monumental.repositories.suggestions.BulkCreateSuggestionRepository;
import com.monumental.repositories.suggestions.CreateSuggestionRepository;
import com.monumental.services.AwsS3Service;
import com.monumental.services.MonumentService;
import com.monumental.util.csvparsing.CsvMonumentConverter;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import com.monumental.util.csvparsing.MonumentBulkValidationResult;
import com.opencsv.CSVReader;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;

/**
 * Test class used to integration test MonumentService
 * The difference between this test class and MonumentServiceIntegrationTests
 * is that this test class has MonumentService mocked so that we can control its behavior better
 * It is separated into its own test class as to not interfere with the other tests
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class MonumentServiceMockIntegrationTests {

    public static Map<String, String> mapping = Map.ofEntries(
            Map.entry("contributions", "contributions"),
            Map.entry("artist", "artist"),
            Map.entry("title", "title"),
            Map.entry("date", "date"),
            Map.entry("materials", "materials"),
            Map.entry("inscription", "inscription"),
            Map.entry("latitude", "latitude"),
            Map.entry("longitude", "longitude"),
            Map.entry("city", "city"),
            Map.entry("state", "state"),
            Map.entry("address", "address"),
            Map.entry("tags", "tags"),
            Map.entry("references", "references"),
            Map.entry("images", "images"),
            Map.entry("deactivatedDate", "deactivatedDate"),
            Map.entry("deactivatedComment", "deactivatedComment")
    );
    private static String headers = "contributions,artist,title,date,materials,inscription,latitude,longitude,city,state,address,tags,references,images,deactivatedDate,deactivatedComment";
    @SpyBean
    private MonumentService monumentServiceMock;
    @MockBean
    private AwsS3Service awsS3ServiceMock;
    @Autowired
    private CreateSuggestionRepository createSuggestionRepository;
    @Autowired
    private BulkCreateSuggestionRepository bulkCreateSuggestionRepository;
    @Autowired
    private MonumentRepository monumentRepository;
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private ReferenceRepository referenceRepository;
    @Autowired
    private ContributionRepository contributionRepository;

    public static List<String[]> parseCSVString(String csvRows) {
        try {
            CSVReader reader = new CSVReader(new StringReader(headers + "\n" + csvRows));
            return reader.readAll();
        } catch (IOException e) {
            e.printStackTrace();
            fail("An IOException occurred");
            return new ArrayList<>();
        }
    }

    private MonumentBulkValidationResult validateCSV(String csvRows) {
        try {
            List<String[]> csvList = parseCSVString(csvRows);
            return this.monumentServiceMock.validateMonumentCSV("Test", csvList, mapping, null);
        } catch (IOException e) {
            e.printStackTrace();
            fail("An IOException occurred");
            return new MonumentBulkValidationResult();
        }
    }

    @Before
    public void initializeMocks() {
        // monumentServiceMock
        Mockito.doReturn(new ArrayList<>()).when(this.monumentServiceMock).findDuplicateMonuments(any(String.class),
                any(Double.class), any(Double.class), any(String.class), any(boolean.class));
        Mockito.doReturn(new ArrayList<>()).when(this.monumentServiceMock).findDuplicateMonuments(any(String.class),
                isNull(), isNull(), any(String.class), any(boolean.class));
        Mockito.doReturn(new ArrayList<>()).when(this.monumentServiceMock).findDuplicateMonuments(any(String.class),
                any(Double.class), any(Double.class), isNull(), any(boolean.class));

        // awsS3ServiceMock
        Mockito.when(this.awsS3ServiceMock.storeObject(any(String.class), any(File.class))).thenReturn("Test URL");
    }

    /**
     * Bulk Creation Tests
     * These tests utilize the 3 methods that comprise the entire bulk-creation flow:
     * 1. validateMonumentsCSV()
     * 2. parseMonumentBulkValidationResult()
     * 3. bulkCreateMonuments()
     */

    @Test
    public void testMonumentService_parseMonumentBulkValidationResult_NullMonumentBulkValidationResult() {
        assertNull(this.monumentServiceMock.parseMonumentBulkValidationResultSync(null));
    }

    @Test
    public void testMonumentService_bulkCreateMonuments_NullBulkCreateMonumentSuggestion() {
        assertNull(this.monumentServiceMock.bulkCreateMonumentsSync(null));
    }

    @Test
    public void testMonumentService_bulkCreateMonuments_NullListOfCreateMonumentSuggestions() {
        BulkCreateMonumentSuggestion bulkCreateSuggestion = new BulkCreateMonumentSuggestion();
        bulkCreateSuggestion.setCreateSuggestions(null);

        assertNull(this.monumentServiceMock.bulkCreateMonumentsSync(bulkCreateSuggestion));
    }

    @Test
    public void testMonumentService_bulkCreateMonuments_UnapprovedBulkCreateMonumentSuggestion() {
        BulkCreateMonumentSuggestion bulkCreateSuggestion = new BulkCreateMonumentSuggestion();
        bulkCreateSuggestion.setCreateSuggestions(new ArrayList<>());
        bulkCreateSuggestion.setIsApproved(false);

        assertNull(this.monumentServiceMock.bulkCreateMonumentsSync(bulkCreateSuggestion));
    }

    @Test
    public void testMonumentService_bulkCreateMonuments_EmptyListOfCreateMonumentSuggestions() {
        BulkCreateMonumentSuggestion bulkCreateSuggestion = new BulkCreateMonumentSuggestion();
        bulkCreateSuggestion.setIsApproved(true);

        List<Monument> results = this.monumentServiceMock.bulkCreateMonumentsSync(bulkCreateSuggestion);

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentService_BulkCreateFlow_OneInvalidCsvRecord() {
        String csvRow = "Test Submitted By,Test Artist,,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000°,180.000°,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";

        // validateMonumentCSV
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRow);

        assertEquals("Test", validationResult.getFileName());
        assertEquals(0, validationResult.getValidResults().size());
        assertEquals(1, validationResult.getInvalidResults().size());

        CsvMonumentConverterResult validationErrors = validationResult.getInvalidResults().get(1);

        assertEquals(1, validationErrors.getWarnings().size());
        assertTrue(validationErrors.getWarnings().contains(CsvMonumentConverter.coordinatesDMSFormatWarning));

        assertEquals(2, validationErrors.getErrors().size());
        assertTrue(validationErrors.getErrors().contains("Title is required"));
        assertTrue(validationErrors.getErrors().contains("All References must be valid URLs (Test Reference)"));

        // parseMonumentBulkValidationResult
        BulkCreateMonumentSuggestion bulkCreateSuggestionResult = this.monumentServiceMock.parseMonumentBulkValidationResultSync(validationResult);

        assertNull(bulkCreateSuggestionResult);
        assertEquals(0, this.createSuggestionRepository.findAll().size());
        assertEquals(0, this.bulkCreateSuggestionRepository.findAll().size());

        // bulkCreateMonuments
        List<Monument> creationResults = this.monumentServiceMock.bulkCreateMonumentsSync(bulkCreateSuggestionResult);

        assertNull(creationResults);
        assertEquals(0, this.monumentRepository.findAll().size());
        assertEquals(0, this.tagRepository.findAll().size());
        assertEquals(0, this.referenceRepository.findAll().size());
        assertEquals(0, this.contributionRepository.findAll().size());
    }

    @Test
    public void testMonumentService_BulkCreateFlow_OneValidRecord() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,40.730610,-73.935242,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";

        // validateMonumentCSV
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRow);

        assertEquals("Test", validationResult.getFileName());
        assertEquals(1, validationResult.getValidResults().size());
        assertEquals(0, validationResult.getInvalidResults().size());

        // parseMonumentBulkValidationResult
        BulkCreateMonumentSuggestion bulkCreateSuggestionResult = this.monumentServiceMock.parseMonumentBulkValidationResultSync(validationResult);

        assertEquals("Test", bulkCreateSuggestionResult.getFileName());
        assertEquals(1, bulkCreateSuggestionResult.getCreateSuggestions().size());
        assertEquals(1, this.createSuggestionRepository.findAll().size());
        assertEquals(1, this.bulkCreateSuggestionRepository.findAll().size());
        assertEquals(1, this.createSuggestionRepository.getAllByBulkCreateSuggestionId(bulkCreateSuggestionResult.getId()).size());

        bulkCreateSuggestionResult.setIsApproved(true);
        bulkCreateSuggestionResult = this.bulkCreateSuggestionRepository.save(bulkCreateSuggestionResult);

        // bulkCreateMonuments
        List<Monument> creationResults = this.monumentServiceMock.bulkCreateMonumentsSync(bulkCreateSuggestionResult);

        assertEquals(1, creationResults.size());
        assertEquals(1, this.monumentRepository.findAll().size());
        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());
        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
        assertEquals(1, this.referenceRepository.findAll().size());
        assertEquals(1, this.contributionRepository.findAll().size());
    }

    @Test
    public void testMonumentService_BulkCreateFlow_TwoInvalidCsvRecords() {
        String csvRows = "Test Submitted By,Test Artist,,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference," +
                "\nTest Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",,";

        // validateMonumentCSV
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRows);

        assertEquals("Test", validationResult.getFileName());
        assertEquals(0, validationResult.getValidResults().size());
        assertEquals(2, validationResult.getInvalidResults().size());

        CsvMonumentConverterResult validationErrorsRow1 = validationResult.getResults().get(1);
        assertEquals(4, validationErrorsRow1.getErrors().size());
        assertTrue(validationErrorsRow1.getErrors().contains("Title is required"));
        assertTrue(validationErrorsRow1.getErrors().contains("All References must be valid URLs (Test Reference)"));
        assertTrue(validationErrorsRow1.getErrors().contains("Latitude is not near the United States"));
        assertTrue(validationErrorsRow1.getErrors().contains("Longitude is not near the United States"));

        CsvMonumentConverterResult validationErrorsRow2 = validationResult.getInvalidResults().get(2);
        assertEquals(3, validationErrorsRow2.getErrors().size());
        assertTrue(validationErrorsRow2.getErrors().contains("At least one Material is required"));
        assertTrue(validationErrorsRow2.getErrors().contains("Latitude is not near the United States"));
        assertTrue(validationErrorsRow2.getErrors().contains("Longitude is not near the United States"));

        // parseMonumentBulkValidationResult
        BulkCreateMonumentSuggestion bulkCreateSuggestionResult = this.monumentServiceMock.parseMonumentBulkValidationResultSync(validationResult);

        assertNull(bulkCreateSuggestionResult);
        assertEquals(0, this.createSuggestionRepository.findAll().size());
        assertEquals(0, this.bulkCreateSuggestionRepository.findAll().size());

        // bulkCreateMonuments
        List<Monument> creationResults = this.monumentServiceMock.bulkCreateMonumentsSync(bulkCreateSuggestionResult);

        assertNull(creationResults);
        assertEquals(0, this.monumentRepository.findAll().size());
        assertEquals(0, this.tagRepository.findAll().size());
        assertEquals(0, this.referenceRepository.findAll().size());
        assertEquals(0, this.contributionRepository.findAll().size());
    }

    @Test
    public void testMonumentService_BulkCreateFlow_TwoValidRecords() {
        String csvRows = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,40.730610,-73.935242,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\n,Test Artist,Test Title,,\"Material 1, Material 2\",,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";

        // validateMonumentCSV
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRows);

        assertEquals("Test", validationResult.getFileName());
        assertEquals(2, validationResult.getValidResults().size());
        assertEquals(0, validationResult.getInvalidResults().size());

        // parseMonumentBulkValidationResult
        BulkCreateMonumentSuggestion bulkCreateSuggestionResult = this.monumentServiceMock.parseMonumentBulkValidationResultSync(validationResult);

        assertEquals("Test", bulkCreateSuggestionResult.getFileName());
        assertEquals(2, bulkCreateSuggestionResult.getCreateSuggestions().size());
        assertEquals(2, this.createSuggestionRepository.findAll().size());
        assertEquals(1, this.bulkCreateSuggestionRepository.findAll().size());
        assertEquals(2, this.createSuggestionRepository.getAllByBulkCreateSuggestionId(bulkCreateSuggestionResult.getId()).size());

        bulkCreateSuggestionResult.setIsApproved(true);
        bulkCreateSuggestionResult = this.bulkCreateSuggestionRepository.save(bulkCreateSuggestionResult);

        // bulkCreateMonuments
        List<Monument> creationResults = this.monumentServiceMock.bulkCreateMonumentsSync(bulkCreateSuggestionResult);

        assertEquals(2, creationResults.size());
        assertEquals(2, this.monumentRepository.findAll().size());
        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());
        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
        assertEquals(2, this.referenceRepository.findAll().size());
        assertEquals(2, this.contributionRepository.findAll().size());
    }

    @Test
    public void testMonumentService_BulkCreateFlow_MixedValidAndInvalidRows() {
        String csvRows = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,40.730610,-73.935242,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\nTest Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,93.000,184.000,Test City,Test State,,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\n,Test Artist,Test Title,,\"Material 1, Material 2\",,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\n,Test Artist,,,,,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";

        // validateMonumentCSV
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRows);

        assertEquals("Test", validationResult.getFileName());
        assertEquals(2, validationResult.getValidResults().size());
        assertEquals(2, validationResult.getInvalidResults().size());

        CsvMonumentConverterResult validationErrorsRow2 = validationResult.getInvalidResults().get(2);
        assertEquals(4, validationErrorsRow2.getErrors().size());
        assertTrue(validationErrorsRow2.getErrors().contains("Latitude is not near the United States"));
        assertTrue(validationErrorsRow2.getErrors().contains("Longitude is not near the United States"));

        CsvMonumentConverterResult validationErrorsRow4 = validationResult.getInvalidResults().get(4);
        assertEquals(2, validationErrorsRow4.getErrors().size());
        assertTrue(validationErrorsRow4.getErrors().contains("Title is required"));
        assertTrue(validationErrorsRow4.getErrors().contains("At least one Material is required"));

        // parseMonumentBulkValidationResult
        BulkCreateMonumentSuggestion bulkCreateSuggestionResult = this.monumentServiceMock.parseMonumentBulkValidationResultSync(validationResult);

        assertEquals("Test", bulkCreateSuggestionResult.getFileName());
        assertEquals(2, bulkCreateSuggestionResult.getCreateSuggestions().size());
        assertEquals(2, this.createSuggestionRepository.findAll().size());
        assertEquals(1, this.bulkCreateSuggestionRepository.findAll().size());
        assertEquals(2, this.createSuggestionRepository.getAllByBulkCreateSuggestionId(bulkCreateSuggestionResult.getId()).size());

        bulkCreateSuggestionResult.setIsApproved(true);
        bulkCreateSuggestionResult = this.bulkCreateSuggestionRepository.save(bulkCreateSuggestionResult);

        // bulkCreateMonuments
        List<Monument> creationResults = this.monumentServiceMock.bulkCreateMonumentsSync(bulkCreateSuggestionResult);

        assertEquals(2, creationResults.size());
        assertEquals(2, this.monumentRepository.findAll().size());
        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());
        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
        assertEquals(2, this.referenceRepository.findAll().size());
        assertEquals(2, this.contributionRepository.findAll().size());
    }
}
