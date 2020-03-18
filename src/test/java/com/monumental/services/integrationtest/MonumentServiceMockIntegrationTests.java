package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.suggestions.BulkCreateMonumentSuggestion;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.TagRepository;
import com.monumental.services.MonumentService;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import com.monumental.util.csvparsing.MonumentBulkValidationResult;
import com.opencsv.CSVReader;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.transaction.Transactional;
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

    @SpyBean
    private MonumentService monumentServiceMock;

    @Autowired
    private MonumentRepository monumentRepository;

    @Autowired
    private TagRepository tagRepository;

    private static String headers = "contributions,artist,title,date,materials,inscription,latitude,longitude,city,state,address,tags,references,images";

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
            Map.entry("images", "images")
    );

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
            return this.monumentServiceMock.validateMonumentCSV(csvList, mapping, null);
        } catch (IOException e) {
            e.printStackTrace();
            fail("An IOException occurred");
            return new MonumentBulkValidationResult();
        }
    }

    @Before
    public void initializeMocks() {
        Mockito.doReturn(new ArrayList<>()).when(this.monumentServiceMock).findDuplicateMonuments(any(String.class),
                any(Double.class), any(Double.class), any(String.class), any(boolean.class));
        Mockito.doReturn(new ArrayList<>()).when(this.monumentServiceMock).findDuplicateMonuments(any(String.class),
                isNull(), isNull(), any(String.class), any(boolean.class));
        Mockito.doReturn(new ArrayList<>()).when(this.monumentServiceMock).findDuplicateMonuments(any(String.class),
                any(Double.class), any(Double.class), isNull(), any(boolean.class));
    }

    /** validateMonumentCSV and bulkCreateMonuments Tests **/

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
    public void testMonumentService_bulkCreateMonuments_EmptyListOfCreateMonumentSuggestions() {
        BulkCreateMonumentSuggestion bulkCreateSuggestion = new BulkCreateMonumentSuggestion();

        List<Monument> results = this.monumentServiceMock.bulkCreateMonumentsSync(bulkCreateSuggestion);

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentService_validateMonumentCSV_bulkCreateMonuments_OneInvalidCsvRecord() {
        String csvRow = "Test Submitted By,Test Artist,,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";

        MonumentBulkValidationResult result = this.validateCSV(csvRow);

        assertEquals(0, result.getValidResults().size());
        assertEquals(1, result.getInvalidResults().size());

        CsvMonumentConverterResult validationErrors = result.getInvalidResults().get(1);
        assertEquals(2, validationErrors.getErrors().size());
        assertTrue(validationErrors.getErrors().contains("Title is required"));
        assertTrue(validationErrors.getErrors().contains("All References must be valid URLs"));
    }

    @Test
    public void testMonumentService_validateMonumentsCSV_OneValidRecord() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";

        MonumentBulkValidationResult result = this.validateCSV(csvRow);

        assertEquals(1, result.getValidResults().size());
        assertEquals(0, result.getInvalidResults().size());
    }

    @Test
    public void testMonumentService_validateMonumentsCSV_TwoInvalidCsvRecords() {
        String csvRows = "Test Submitted By,Test Artist,,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference," +
                "\nTest Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",,";

        MonumentBulkValidationResult result = this.validateCSV(csvRows);

        assertEquals(0, result.getValidResults().size());
        assertEquals(2, result.getInvalidResults().size());


        CsvMonumentConverterResult validationErrorsRow1 = result.getResults().get(1);
        assertEquals(2, validationErrorsRow1.getErrors().size());
        assertTrue(validationErrorsRow1.getErrors().contains("Title is required"));
        assertTrue(validationErrorsRow1.getErrors().contains("All References must be valid URLs"));

        CsvMonumentConverterResult validationErrorsRow2 = result.getInvalidResults().get(2);
        assertEquals(1, validationErrorsRow2.getErrors().size());
        assertTrue(validationErrorsRow2.getErrors().contains("At least one Material is required"));
    }

    @Test
    public void testMonumentService_validateMonumentsCSV_TwoValidRecords() {
        String csvRows = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\n,Test Artist,Test Title,,\"Material 1, Material 2\",,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";

        MonumentBulkValidationResult result = this.validateCSV(csvRows);

        assertEquals(2, result.getValidResults().size());
        assertEquals(0, result.getInvalidResults().size());
    }

    @Test
    public void testMonumentService_validateMonumentsCSV_MixedValidAndInvalidRows() {
        String csvRows = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\nTest Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,93.000,184.000,Test City,Test State,,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\n,Test Artist,Test Title,,\"Material 1, Material 2\",,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\n,Test Artist,,,,,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";

        MonumentBulkValidationResult result = this.validateCSV(csvRows);

        assertEquals(2, result.getValidResults().size());
        assertEquals(2, result.getInvalidResults().size());

        CsvMonumentConverterResult validationErrorsRow2 = result.getInvalidResults().get(2);
        assertEquals(2, validationErrorsRow2.getErrors().size());
        assertTrue(validationErrorsRow2.getErrors().contains("Latitude must be valid"));
        assertTrue(validationErrorsRow2.getErrors().contains("Longitude must be valid"));

        CsvMonumentConverterResult validationErrorsRow4 = result.getInvalidResults().get(4);
        assertEquals(2, validationErrorsRow4.getErrors().size());
        assertTrue(validationErrorsRow4.getErrors().contains("Title is required"));
        assertTrue(validationErrorsRow4.getErrors().contains("At least one Material is required"));
    }

    /** bulkCreateMonuments Tests **/

    /*@Test
    public void testMonumentService_bulkCreateMonuments_OneInvalidCsvRecord() {
        String csvRow = "Test Submitted By,Test Artist,,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRow);

        List<Monument> creationResult = this.monumentServiceMock.bulkCreateMonumentsSync(
                new ArrayList<>(validationResult.getValidResults().values())
        );

        assertEquals(0, creationResult.size());
    }

    @Test
    public void testMonumentService_bulkCreateMonuments_OneValidRecord() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRow);

        List<Monument> creationResult = this.monumentServiceMock.bulkCreateMonumentsSync(
                new ArrayList<>(validationResult.getValidResults().values())
        );

        assertEquals(1, creationResult.size());
        assertEquals(1, this.monumentRepository.findAll().size());

        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());

        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
    }

    @Test
    public void testMonumentService_bulkCreateMonuments_TwoInvalidCsvRecords() {
        String csvRows = "Test Submitted By,Test Artist,,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference," +
                "\nTest Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",,";
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRows);

        List<Monument> creationResult = this.monumentServiceMock.bulkCreateMonumentsSync(
                new ArrayList<>(validationResult.getValidResults().values())
        );

        assertEquals(0, creationResult.size());
    }

    @Test
    public void testMonumentService_bulkCreateMonuments_TwoValidRecords() {
        String csvRows = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\n,Test Artist,Test Title,,\"Material 1, Material 2\",,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRows);

        List<Monument> creationResult = this.monumentServiceMock.bulkCreateMonumentsSync(
                new ArrayList<>(validationResult.getValidResults().values())
        );

        assertEquals(2, validationResult.getValidResults().size());
        assertEquals(0, validationResult.getInvalidResults().size());

        assertEquals(2, creationResult.size());
        assertEquals(2, this.monumentRepository.findAll().size());

        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());

        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
    }

    @Test
    public void testMonumentService_bulkCreateMonuments_MixedValidAndInvalidRows() {
        String csvRows = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\nTest Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,93.000,184.000,Test City,Test State,,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\n,Test Artist,Test Title,,\"Material 1, Material 2\",,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                "\n,Test Artist,,,,,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";

        MonumentBulkValidationResult validationResult = this.validateCSV(csvRows);

        List<Monument> creationResult = this.monumentServiceMock.bulkCreateMonumentsSync(
                new ArrayList<>(validationResult.getValidResults().values())
        );

        assertEquals(2, creationResult.size());
        assertEquals(2, this.monumentRepository.findAll().size());

        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());

        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
    }*/
}
