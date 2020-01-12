package com.monumental.services.integrationtest;

import com.monumental.controllers.helpers.MonumentAboutPageStatistics;
import com.monumental.models.Image;
import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.models.Tag;
import com.monumental.repositories.ImageRepository;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.ReferenceRepository;
import com.monumental.repositories.TagRepository;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import com.monumental.util.csvparsing.MonumentBulkValidationResult;
import com.opencsv.CSVReader;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.transaction.Transactional;
import java.io.IOException;
import java.io.StringReader;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.*;

import static org.junit.Assert.*;

/**
 * Test class used to integration test MonumentService
 * Makes use of an in-memory H2 database as to not ruin the real one
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class MonumentServiceIntegrationTests {

    @Autowired
    MonumentService monumentService;

    @Autowired
    MonumentRepository monumentRepository;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    TagService tagService;

    @Autowired
    ReferenceRepository referenceRepository;

    @Autowired
    ImageRepository imageRepository;

    public static String headers = "contributions,artist,title,date,materials,inscription,latitude,longitude,city,state,address,tags,references,images";

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

    /** bulkCreateMonumentsFromCsv Tests **/

    private MonumentBulkValidationResult validateCSV(String csvRows) {
        try {
            List<String[]> csvList = parseCSVString(csvRows);
            return this.monumentService.validateMonumentCSV(csvList, mapping, null);
        } catch (IOException e) {
            e.printStackTrace();
            fail("An IOException occurred");
            return new MonumentBulkValidationResult();
        }
    }

    /** bulkCreateMonumentsFromCsv Tests **/

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_EmptyCsvList() {
        List<CsvMonumentConverterResult> csvResults = new ArrayList<>();

        List<Monument> results = this.monumentService.bulkCreateMonumentsSync(csvResults);

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_OneInvalidCsvRecord() {
        String csvRow = "Test Submitted By,Test Artist,,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRow);

        List<Monument> creationResult = this.monumentService.bulkCreateMonumentsSync(
            new ArrayList<CsvMonumentConverterResult>(validationResult.getValidResults().values())
        );

        assertEquals(0, creationResult.size());

        assertEquals(0, validationResult.getValidResults().size());
        assertEquals(1, validationResult.getInvalidResults().size());

        CsvMonumentConverterResult validationErrors = validationResult.getInvalidResults().get(1);
        assertEquals(2, validationErrors.getErrors().size());
        assertTrue(validationErrors.getErrors().contains("Title is required"));
        assertTrue(validationErrors.getErrors().contains("All References must be valid URLs"));
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_OneValidRecord() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRow);

        List<Monument> creationResult = this.monumentService.bulkCreateMonumentsSync(
            new ArrayList<CsvMonumentConverterResult>(validationResult.getValidResults().values())
        );

        assertEquals(1, validationResult.getValidResults().size());
        assertEquals(0, validationResult.getInvalidResults().size());

        assertEquals(1, creationResult.size());
        assertEquals(1, this.monumentRepository.findAll().size());

        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());

        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_TwoInvalidCsvRecords() {
        String csvRows = "Test Submitted By,Test Artist,,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference," +
                         "\nTest Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",,";
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRows);

        List<Monument> creationResult = this.monumentService.bulkCreateMonumentsSync(
            new ArrayList<CsvMonumentConverterResult>(validationResult.getValidResults().values())
        );

        assertEquals(0, validationResult.getValidResults().size());
        assertEquals(0, creationResult.size());

        assertEquals(2, validationResult.getInvalidResults().size());


        CsvMonumentConverterResult validationErrorsRow1 = validationResult.getResults().get(1);
        assertEquals(2, validationErrorsRow1.getErrors().size());
        assertTrue(validationErrorsRow1.getErrors().contains("Title is required"));
        assertTrue(validationErrorsRow1.getErrors().contains("All References must be valid URLs"));

        CsvMonumentConverterResult validationErrorsRow2 = validationResult.getInvalidResults().get(2);
        assertEquals(1, validationErrorsRow2.getErrors().size());
        assertTrue(validationErrorsRow2.getErrors().contains("At least one Material is required"));
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_TwoValidRecords() {
        String csvRows = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                         "\n,Test Artist,Test Title,,\"Material 1, Material 2\",,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";
        MonumentBulkValidationResult validationResult = this.validateCSV(csvRows);

        List<Monument> creationResult = this.monumentService.bulkCreateMonumentsSync(
            new ArrayList<CsvMonumentConverterResult>(validationResult.getValidResults().values())
        );

        assertEquals(2, validationResult.getValidResults().size());
        assertEquals(0, validationResult.getInvalidResults().size());

        assertEquals(2, creationResult.size());
        assertEquals(2, this.monumentRepository.findAll().size());

        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());

        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_MixedValidAndInvalidRows() {
        String csvRows = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                         "\nTest Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,93.000,184.000,Test City,Test State,,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                         "\n,Test Artist,Test Title,,\"Material 1, Material 2\",,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com," +
                         "\n,Test Artist,,,,,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";

        MonumentBulkValidationResult validationResult = this.validateCSV(csvRows);

        List<Monument> creationResult = this.monumentService.bulkCreateMonumentsSync(
            new ArrayList<CsvMonumentConverterResult>(validationResult.getValidResults().values())
        );

        assertEquals(2, validationResult.getValidResults().size());
        assertEquals(2, validationResult.getInvalidResults().size());

        CsvMonumentConverterResult validationErrorsRow2 = validationResult.getInvalidResults().get(2);
        assertEquals(2, validationErrorsRow2.getErrors().size());
        assertTrue(validationErrorsRow2.getErrors().contains("Latitude must be valid"));
        assertTrue(validationErrorsRow2.getErrors().contains("Longitude must be valid"));

        CsvMonumentConverterResult validationErrorsRow4 = validationResult.getInvalidResults().get(4);
        assertEquals(2, validationErrorsRow4.getErrors().size());
        assertTrue(validationErrorsRow4.getErrors().contains("Title is required"));
        assertTrue(validationErrorsRow4.getErrors().contains("At least one Material is required"));

        assertEquals(2, creationResult.size());
        assertEquals(2, this.monumentRepository.findAll().size());

        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());

        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
    }

    /* getRelatedMonumentsByTags Tests */

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_NullTagsList() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument = this.monumentRepository.save(monument);

        assertNull(this.monumentService.getRelatedMonumentsByTags(null, monument.getId(), 10));
    }

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_NullMonumentId() {
        assertNull(this.monumentService.getRelatedMonumentsByTags(new ArrayList<>(), null, 10));
    }

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_NullLimit() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument = this.monumentRepository.save(monument);

        assertNull(this.monumentService.getRelatedMonumentsByTags(new ArrayList<>(), monument.getId(), null));
    }

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_EmptyTagsList() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument = this.monumentRepository.save(monument);

        List<Monument> results = this.monumentService.getRelatedMonumentsByTags(new ArrayList<>(), monument.getId(), 10);

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_NoTagsWithSpecifiedNames() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        this.tagService.createTag("Tag", monuments, false);

        List<String> tagNames = new ArrayList<>();
        tagNames.add("Test");

        List<Monument> results = this.monumentService.getRelatedMonumentsByTags(tagNames, monument.getId(), 10);

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_NoAssociatedTags() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument = this.monumentRepository.save(monument);

        Tag tag = this.tagService.createTag("Tag", new ArrayList<>(), false);

        List<String> tagNames = new ArrayList<>();
        tagNames.add(tag.getName());

        List<Monument> results = this.monumentService.getRelatedMonumentsByTags(tagNames, monument.getId(), 10);

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_NoRelatedMonuments() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2 = this.monumentRepository.save(monument2);

        List<Monument> monument1List = new ArrayList<>();
        monument1List.add(monument1);

        List<Monument> monument2List = new ArrayList<>();
        monument2List.add(monument2);

        Tag tag1 = this.tagService.createTag("Tag 1", monument1List, false);

        List<String> tag1NameList = new ArrayList<>();
        tag1NameList.add(tag1.getName());

        Tag tag2 = this.tagService.createTag("Tag 2", monument2List, false);

        List<String> tag2NameList = new ArrayList<>();
        tag2NameList.add(tag2.getName());

        List<Monument> monument1RelatedMonuments = this.monumentService.getRelatedMonumentsByTags(tag1NameList, monument1.getId(), 10);

        assertEquals(0, monument1RelatedMonuments.size());

        List<Monument> monument2RelatedMonuments = this.monumentService.getRelatedMonumentsByTags(tag2NameList, monument2.getId(), 10);

        assertEquals(0, monument2RelatedMonuments.size());
    }

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_TwoMonumentsRelated() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2 = this.monumentRepository.save(monument2);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);
        monuments.add(monument2);

        Tag tag = this.tagService.createTag("Tag", monuments, false);

        List<String> tagNames = new ArrayList<>();
        tagNames.add(tag.getName());

        List<Monument> monument1RelatedMonuments = this.monumentService.getRelatedMonumentsByTags(tagNames, monument1.getId(), 10);

        assertEquals(1, monument1RelatedMonuments.size());

        Monument monument1RelatedMonument = monument1RelatedMonuments.get(0);
        assertEquals(monument2.getTitle(), monument1RelatedMonument.getTitle());

        List<Monument> monument2RelatedMonuments = this.monumentService.getRelatedMonumentsByTags(tagNames, monument2.getId(), 10);

        assertEquals(1, monument2RelatedMonuments.size());

        Monument monument2RelatedMonument = monument2RelatedMonuments.get(0);
        assertEquals(monument1.getTitle(), monument2RelatedMonument.getTitle());
    }

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_ThreeMonuments_TwoRelated() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2 = this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3 = this.monumentRepository.save(monument3);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);
        monuments.add(monument3);

        List<Monument> monument2List = new ArrayList<>();
        monument2List.add(monument2);

        Tag tag1 = this.tagService.createTag("Tag 1", monuments, false);

        Tag tag2 = this.tagService.createTag("Tag 2", monument2List, false);

        List<String> tag1NameList = new ArrayList<>();
        tag1NameList.add(tag1.getName());

        List<String> tag2NameList = new ArrayList<>();
        tag2NameList.add(tag2.getName());

        List<Monument> monument1RelatedMonuments = this.monumentService.getRelatedMonumentsByTags(tag1NameList, monument1.getId(), 10);

        assertEquals(1, monument1RelatedMonuments.size());

        Monument monument1RelatedMonument = monument1RelatedMonuments.get(0);
        assertEquals(monument3.getTitle(), monument1RelatedMonument.getTitle());

        List<Monument> monument2RelatedMonuments = this.monumentService.getRelatedMonumentsByTags(tag2NameList, monument2.getId(), 10);

        assertEquals(0, monument2RelatedMonuments.size());

        List<Monument> monument3RelatedMonuments = this.monumentService.getRelatedMonumentsByTags(tag1NameList, monument3.getId(), 10);

        assertEquals(1, monument3RelatedMonuments.size());

        Monument monument3RelatedMonument = monument3RelatedMonuments.get(0);
        assertEquals(monument1.getTitle(), monument3RelatedMonument.getTitle());
    }

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_FiveMonuments_VariousRelations_CorrectMatchingTagCountOrdering() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2 = this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3 = this.monumentRepository.save(monument3);

        Monument monument4 = new Monument();
        monument4.setTitle("Monument 4");
        monument4 = this.monumentRepository.save(monument4);

        Monument monument5 = new Monument();
        monument5.setTitle("Monument 5");
        monument5 = this.monumentRepository.save(monument5);

        List<Monument> monumentsForTag1 = new ArrayList<>();
        monumentsForTag1.add(monument1);
        monumentsForTag1.add(monument2);
        monumentsForTag1.add(monument3);
        monumentsForTag1.add(monument4);
        monumentsForTag1.add(monument5);

        List<Monument> monumentsForTag2 = new ArrayList<>();
        monumentsForTag2.add(monument1);
        monumentsForTag2.add(monument3);
        monumentsForTag2.add(monument4);
        monumentsForTag2.add(monument5);

        List<Monument> monumentsForTag3 = new ArrayList<>();
        monumentsForTag3.add(monument1);
        monumentsForTag3.add(monument4);
        monumentsForTag3.add(monument5);

        List<Monument> monumentsForTag4 = new ArrayList<>();
        monumentsForTag4.add(monument1);
        monumentsForTag4.add(monument5);

        Tag tag1 = this.tagService.createTag("Tag 1", monumentsForTag1, false);
        Tag tag2 = this.tagService.createTag("Tag 2", monumentsForTag2, false);
        Tag tag3 = this.tagService.createTag("Tag 3", monumentsForTag3, false);
        Tag tag4 = this.tagService.createTag("Tag 4", monumentsForTag4, false);

        List<String> tagNames = new ArrayList<>();
        tagNames.add(tag1.getName());
        tagNames.add(tag2.getName());
        tagNames.add(tag3.getName());
        tagNames.add(tag4.getName());

        List<Monument> monument1RelatedMonuments = this.monumentService.getRelatedMonumentsByTags(tagNames, monument1.getId(), 10);

        assertEquals(4, monument1RelatedMonuments.size());

        Monument monument1FirstRelatedMonument = monument1RelatedMonuments.get(0);
        assertEquals(monument5.getTitle(), monument1FirstRelatedMonument.getTitle());

        Monument monument1SecondRelatedMonument = monument1RelatedMonuments.get(1);
        assertEquals(monument4.getTitle(), monument1SecondRelatedMonument.getTitle());

        Monument monument1ThirdRelatedMonument = monument1RelatedMonuments.get(2);
        assertEquals(monument3.getTitle(), monument1ThirdRelatedMonument.getTitle());

        Monument monument1FourthRelatedMonument = monument1RelatedMonuments.get(3);
        assertEquals(monument2.getTitle(), monument1FourthRelatedMonument.getTitle());
    }

    @Test
    public void testMonumentService_getRelatedMonumentsByTags_FiveMonuments_LimitRelatedMonuments() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2 = this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3 = this.monumentRepository.save(monument3);

        Monument monument4 = new Monument();
        monument4.setTitle("Monument 4");
        monument4 = this.monumentRepository.save(monument4);

        Monument monument5 = new Monument();
        monument5.setTitle("Monument 5");
        monument5 = this.monumentRepository.save(monument5);

        List<Monument> monumentsForTag1 = new ArrayList<>();
        monumentsForTag1.add(monument1);
        monumentsForTag1.add(monument2);
        monumentsForTag1.add(monument3);
        monumentsForTag1.add(monument4);
        monumentsForTag1.add(monument5);

        List<Monument> monumentsForTag2 = new ArrayList<>();
        monumentsForTag2.add(monument1);
        monumentsForTag2.add(monument3);
        monumentsForTag2.add(monument4);
        monumentsForTag2.add(monument5);

        List<Monument> monumentsForTag3 = new ArrayList<>();
        monumentsForTag3.add(monument1);
        monumentsForTag3.add(monument4);
        monumentsForTag3.add(monument5);

        List<Monument> monumentsForTag4 = new ArrayList<>();
        monumentsForTag4.add(monument1);
        monumentsForTag4.add(monument5);

        Tag tag1 = this.tagService.createTag("Tag 1", monumentsForTag1, false);
        Tag tag2 = this.tagService.createTag("Tag 2", monumentsForTag2, false);
        Tag tag3 = this.tagService.createTag("Tag 3", monumentsForTag3, false);
        Tag tag4 = this.tagService.createTag("Tag 4", monumentsForTag4, false);

        List<String> tagNames = new ArrayList<>();
        tagNames.add(tag1.getName());
        tagNames.add(tag2.getName());
        tagNames.add(tag3.getName());
        tagNames.add(tag4.getName());

        List<Monument> monument1RelatedMonuments = this.monumentService.getRelatedMonumentsByTags(tagNames, monument1.getId(), 2);

        assertEquals(2, monument1RelatedMonuments.size());

        Monument monument1FirstRelatedMonument = monument1RelatedMonuments.get(0);
        assertEquals(monument5.getTitle(), monument1FirstRelatedMonument.getTitle());

        Monument monument1SecondRelatedMonument = monument1RelatedMonuments.get(1);
        assertEquals(monument4.getTitle(), monument1SecondRelatedMonument.getTitle());
    }

    /** getMonumentAboutPageStatistics Tests **/

    @Test
    public void testMonumentService_getMonumentAboutPageStatistics_NoMonuments() {
        MonumentAboutPageStatistics result = this.monumentService.getMonumentAboutPageStatistics();

        assertEquals(0, result.getTotalNumberOfMonuments());
        assertNull(result.getOldestMonument());
        assertNull(result.getNewestMonument());
        assertNull(result.getNumberOfMonumentsByState());
        assertNull(result.getRandomState());
        assertEquals(0, result.getNumberOfMonumentsInRandomState());
        assertNull(result.getRandomTagName());
        assertEquals(0, result.getNumberOfMonumentsWithRandomTag());
    }

    @Test
    public void testMonumentService_getMonumentAboutPageStatistics_OneMonument_NullDate_NullState() {
        Monument monument = new Monument();
        this.monumentRepository.save(monument);

        MonumentAboutPageStatistics result = this.monumentService.getMonumentAboutPageStatistics();

        assertEquals(1, result.getTotalNumberOfMonuments());
        assertNull(result.getOldestMonument());
        assertNull(result.getNewestMonument());
        assertNull(result.getNumberOfMonumentsByState());
        assertNull(result.getRandomState());
        assertEquals(0, result.getNumberOfMonumentsInRandomState());
        assertNull(result.getRandomTagName());
        assertEquals(0, result.getNumberOfMonumentsWithRandomTag());
    }

    @Test
    public void testMonumentService_getMonumentAboutPageStatistics_OneMonument_NotNullDate_NullState() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument.setDate(new Date());
        this.monumentRepository.save(monument);

        MonumentAboutPageStatistics result = this.monumentService.getMonumentAboutPageStatistics();

        assertEquals(1, result.getTotalNumberOfMonuments());
        assertEquals("Monument", result.getOldestMonument().getTitle());
        assertEquals("Monument", result.getNewestMonument().getTitle());
        assertNull(result.getNumberOfMonumentsByState());
        assertNull(result.getRandomState());
        assertEquals(0, result.getNumberOfMonumentsInRandomState());
        assertNull(result.getRandomTagName());
        assertEquals(0, result.getNumberOfMonumentsWithRandomTag());
    }

    @Test
    public void testMonumentService_getMonumentAboutPageStatistics_OneMonument_NullDate_NotNullState() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument.setState("New York");
        this.monumentRepository.save(monument);

        MonumentAboutPageStatistics result = this.monumentService.getMonumentAboutPageStatistics();

        assertEquals(1, result.getTotalNumberOfMonuments());
        assertNull(result.getOldestMonument());
        assertNull(result.getNewestMonument());
        assertEquals(1, result.getNumberOfMonumentsByState().size());
        assertEquals(Integer.valueOf(1), result.getNumberOfMonumentsByState().get("New York"));
        assertEquals("New York", result.getRandomState());
        assertEquals(1, result.getNumberOfMonumentsInRandomState());
        assertNull(result.getRandomTagName());
        assertEquals(0, result.getNumberOfMonumentsWithRandomTag());
    }

    @Test
    public void testMonumentService_getMonumentAboutPageStatistics_OneMonument_NotNullDate_NotNullState() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument.setDate(new Date());
        monument.setState("New York");
        this.monumentRepository.save(monument);

        MonumentAboutPageStatistics result = this.monumentService.getMonumentAboutPageStatistics();

        assertEquals(1, result.getTotalNumberOfMonuments());
        assertEquals("Monument", result.getOldestMonument().getTitle());
        assertEquals("Monument", result.getNewestMonument().getTitle());
        assertEquals(1, result.getNumberOfMonumentsByState().size());
        assertEquals(Integer.valueOf(1), result.getNumberOfMonumentsByState().get("New York"));
        assertEquals("New York", result.getRandomState());
        assertEquals(1, result.getNumberOfMonumentsInRandomState());
        assertNull(result.getRandomTagName());
        assertEquals(0, result.getNumberOfMonumentsWithRandomTag());
    }

    @Test
    public void testMonumentService_getMonumentAboutPageStatistics_OneMonument_Tags() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument.setDate(new Date());
        monument.setState("New York");
        this.monumentRepository.save(monument);

        Tag tag = new Tag();
        tag.setName("Tag");
        tag.addMonument(monument);
        this.tagRepository.save(tag);

        MonumentAboutPageStatistics result = this.monumentService.getMonumentAboutPageStatistics();

        assertEquals(1, result.getTotalNumberOfMonuments());
        assertEquals("Monument", result.getOldestMonument().getTitle());
        assertEquals("Monument", result.getNewestMonument().getTitle());
        assertEquals(1, result.getNumberOfMonumentsByState().size());
        assertEquals(Integer.valueOf(1), result.getNumberOfMonumentsByState().get("New York"));
        assertEquals("New York", result.getRandomState());
        assertEquals(1, result.getNumberOfMonumentsInRandomState());
        assertEquals("Tag", result.getRandomTagName());
        assertEquals(1, result.getNumberOfMonumentsWithRandomTag());
    }

    @Test
    public void testMonumentService_getMonumentAboutPageStatistics_ThreeMonuments() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1.setDate(new Date());
        monument1.setState("New York");
        this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2.setDate(Date.from(ZonedDateTime.now().minusMonths(1).toInstant()));
        monument2.setState("Rhode Island");
        this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3.setDate(Date.from(ZonedDateTime.now().minusMonths(3).toInstant()));
        monument3.setState("Rhode Island");
        this.monumentRepository.save(monument3);

        Tag tag1 = new Tag();
        tag1.setName("Tag 1");
        tag1.addMonument(monument1);
        this.tagRepository.save(tag1);

        Tag tag2 = new Tag();
        tag2.setName("Tag 2");
        tag2.addMonument(monument2);
        this.tagRepository.save(tag2);

        List<String> usedStates = new ArrayList<>();
        usedStates.add("New York");
        usedStates.add("Rhode Island");

        List<String> usedTagNames = new ArrayList<>();
        usedTagNames.add("Tag 1");
        usedTagNames.add("Tag 2");

        MonumentAboutPageStatistics result = this.monumentService.getMonumentAboutPageStatistics();

        assertEquals(3, result.getTotalNumberOfMonuments());
        assertEquals("Monument 3", result.getOldestMonument().getTitle());
        assertEquals("Monument 1", result.getNewestMonument().getTitle());
        assertEquals(2, result.getNumberOfMonumentsByState().size());
        assertEquals(Integer.valueOf(1), result.getNumberOfMonumentsByState().get("New York"));
        assertEquals(Integer.valueOf(2), result.getNumberOfMonumentsByState().get("Rhode Island"));
        assertTrue(usedStates.contains(result.getRandomState()));
        assertTrue(usedTagNames.contains(result.getRandomTagName()));
    }

    /* updateMonumentReferences Tests **/

    @Test
    public void testMonumentService_updateMonumentReferences_NullMonument() {
        Monument monument = null;

        this.monumentService.updateMonumentReferences(monument, new HashMap<>());

        assertNull(monument);
    }

    @Test
    public void testMonumentService_updateMonumentReferences_NullMonumentReferences() {
        Monument monument = new Monument();
        monument.setReferences(null);

        this.monumentService.updateMonumentReferences(monument, new HashMap<>());

        assertNull(monument.getReferences());
    }

    @Test
    public void testMonumentService_updateMonumentReferences_NullNewReferenceUrlsById() {
        Monument monument = new Monument();

        this.monumentService.updateMonumentReferences(monument, null);

        assertEquals(0, monument.getReferences().size());
    }

    @Test
    public void testMonumentService_updateMonumentReferences_NoReferences() {
        Monument monument = new Monument();

        Map<Integer, String> newReferenceUrlsById = new HashMap<>();
        newReferenceUrlsById.put(1, "test");

        this.monumentService.updateMonumentReferences(monument, newReferenceUrlsById);

        assertEquals(0, monument.getReferences().size());
    }

    @Test
    public void testMonumentService_updateMonumentReferences_EmptyNewReferenceUrlsById() {
        Monument monument = new Monument();

        Reference reference = new Reference();
        reference.setUrl("URL");

        monument.getReferences().add(reference);

        this.monumentService.updateMonumentReferences(monument, new HashMap<>());

        assertEquals(1, monument.getReferences().size());
        assertEquals("URL", monument.getReferences().get(0).getUrl());
    }

    @Test
    public void testMonumentService_updateMonumentReferences_UpdateOneReference() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Reference reference = new Reference();
        reference.setUrl("URL");
        reference.setMonument(monument);
        reference = this.referenceRepository.save(reference);

        monument.getReferences().add(reference);

        Map<Integer, String> newReferenceUrlsById = new HashMap<>();
        newReferenceUrlsById.put(reference.getId(), "Test");

        this.monumentService.updateMonumentReferences(monument, newReferenceUrlsById);

        assertEquals(1, monument.getReferences().size());
        assertEquals("Test", monument.getReferences().get(0).getUrl());
        assertEquals(1, this.referenceRepository.getAllByUrl("Test").size());
        assertEquals(0, this.referenceRepository.getAllByUrl("URL").size());
    }

    @Test
    public void testMonumentService_updateMonumentReferences_UpdateTwoReferencesOutOfThree() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Reference reference1 = new Reference();
        reference1.setUrl("Reference 1");
        reference1.setMonument(monument);
        reference1 = this.referenceRepository.save(reference1);

        monument.getReferences().add(reference1);

        Reference reference2 = new Reference();
        reference2.setUrl("Reference 2");
        reference2.setMonument(monument);
        reference2 = this.referenceRepository.save(reference2);

        monument.getReferences().add(reference2);

        Reference reference3 = new Reference();
        reference3.setUrl("Reference 3");
        reference3.setMonument(monument);
        reference3 = this.referenceRepository.save(reference3);

        monument.getReferences().add(reference3);

        Map<Integer, String> newReferenceUrlsById = new HashMap<>();
        newReferenceUrlsById.put(reference1.getId(), "Test");
        newReferenceUrlsById.put(reference3.getId(), "Test 2");

        this.monumentService.updateMonumentReferences(monument, newReferenceUrlsById);

        assertEquals(3, monument.getReferences().size());
        assertEquals("Test", monument.getReferences().get(0).getUrl());
        assertEquals("Test 2", monument.getReferences().get(2).getUrl());
        assertEquals(1, this.referenceRepository.getAllByUrl("Test").size());
        assertEquals(0, this.referenceRepository.getAllByUrl("Reference 1").size());
        assertEquals(1, this.referenceRepository.getAllByUrl("Reference 2").size());
        assertEquals(1, this.referenceRepository.getAllByUrl("Test 2").size());
        assertEquals(0, this.referenceRepository.getAllByUrl("Reference 3").size());
    }

    @Test
    public void testMonumentService_updateMonumentReferences_UpdateAllThreeReferences() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Reference reference1 = new Reference();
        reference1.setUrl("Reference 1");
        reference1.setMonument(monument);
        reference1 = this.referenceRepository.save(reference1);

        monument.getReferences().add(reference1);

        Reference reference2 = new Reference();
        reference2.setUrl("Reference 2");
        reference2.setMonument(monument);
        reference2 = this.referenceRepository.save(reference2);

        monument.getReferences().add(reference2);

        Reference reference3 = new Reference();
        reference3.setUrl("Reference 3");
        reference3.setMonument(monument);
        reference3 = this.referenceRepository.save(reference3);

        monument.getReferences().add(reference3);

        Map<Integer, String> newReferenceUrlsById = new HashMap<>();
        newReferenceUrlsById.put(reference1.getId(), "Test");
        newReferenceUrlsById.put(reference2.getId(), "Test 2");
        newReferenceUrlsById.put(reference3.getId(), "Test 3");

        this.monumentService.updateMonumentReferences(monument, newReferenceUrlsById);

        assertEquals(3, monument.getReferences().size());
        assertEquals("Test", monument.getReferences().get(0).getUrl());
        assertEquals("Test 2", monument.getReferences().get(1).getUrl());
        assertEquals("Test 3", monument.getReferences().get(2).getUrl());
        assertEquals(1, this.referenceRepository.getAllByUrl("Test").size());
        assertEquals(0, this.referenceRepository.getAllByUrl("Reference 1").size());
        assertEquals(1, this.referenceRepository.getAllByUrl("Test 2").size());
        assertEquals(0, this.referenceRepository.getAllByUrl("Reference 2").size());
        assertEquals(1, this.referenceRepository.getAllByUrl("Test 3").size());
        assertEquals(0, this.referenceRepository.getAllByUrl("Reference 3").size());
    }

    /* deleteMonumentReferences Tests */

    @Test
    public void testMonumentService_deleteMonumentReferences_NullMonument() {
        Monument monument = null;

        this.monumentService.deleteMonumentReferences(monument, new ArrayList<>());

        assertNull(monument);
    }

    @Test
    public void testMonumentService_deleteMonumentReferences_NullDeletedReferenceIds() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Reference reference = new Reference();
        reference.setUrl("URL");
        reference.setMonument(monument);
        reference = this.referenceRepository.save(reference);

        monument.getReferences().add(reference);

        this.monumentService.deleteMonumentReferences(monument, null);

        assertEquals(1, monument.getReferences().size());
        assertEquals(1, this.monumentRepository.findAll().size());
    }

    @Test
    public void testMonumentService_deleteMonumentReferences_EmptyDeletedReferenceIds() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Reference reference = new Reference();
        reference.setUrl("URL");
        reference.setMonument(monument);
        reference = this.referenceRepository.save(reference);

        monument.getReferences().add(reference);

        this.monumentService.deleteMonumentReferences(monument, new ArrayList<>());

        assertEquals(1, monument.getReferences().size());
        assertEquals(1, this.monumentRepository.findAll().size());
    }

    @Test
    public void testMonumentService_deleteMonumentReferences_DeleteOneReference() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Reference reference = new Reference();
        reference.setUrl("URL");
        reference.setMonument(monument);
        reference = this.referenceRepository.save(reference);

        monument.getReferences().add(reference);

        List<Integer> deletedReferenceIds = new ArrayList<>();
        deletedReferenceIds.add(reference.getId());

        this.monumentService.deleteMonumentReferences(monument, deletedReferenceIds);

        assertEquals(0, monument.getReferences().size());

        Optional<Reference> referenceOptional = this.referenceRepository.findById(reference.getId());
        assertTrue(referenceOptional.isEmpty());
    }

    @Test
    public void testMonumentService_deleteMonumentReferences_DeleteTwoOfThreeReferences() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Reference reference1 = new Reference();
        reference1.setUrl("URL");
        reference1.setMonument(monument);
        reference1 = this.referenceRepository.save(reference1);

        monument.getReferences().add(reference1);

        Reference reference2 = new Reference();
        reference2.setUrl("URL");
        reference2.setMonument(monument);
        reference2 = this.referenceRepository.save(reference2);

        monument.getReferences().add(reference2);

        Reference reference3 = new Reference();
        reference3.setUrl("URL");
        reference3.setMonument(monument);
        reference3 = this.referenceRepository.save(reference3);

        monument.getReferences().add(reference3);

        List<Integer> deletedReferenceIds = new ArrayList<>();
        deletedReferenceIds.add(reference1.getId());
        deletedReferenceIds.add(reference3.getId());

        this.monumentService.deleteMonumentReferences(monument, deletedReferenceIds);

        assertEquals(1, monument.getReferences().size());
        assertEquals(reference2.getId(), monument.getReferences().get(0).getId());

        assertEquals(1, this.referenceRepository.findAll().size());
    }

    @Test
    public void testMonumentService_deleteMonumentReferences_DeleteAllThreeReferences() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Reference reference1 = new Reference();
        reference1.setUrl("URL");
        reference1.setMonument(monument);
        reference1 = this.referenceRepository.save(reference1);

        monument.getReferences().add(reference1);

        Reference reference2 = new Reference();
        reference2.setUrl("URL");
        reference2.setMonument(monument);
        reference2 = this.referenceRepository.save(reference2);

        monument.getReferences().add(reference2);

        Reference reference3 = new Reference();
        reference3.setUrl("URL");
        reference3.setMonument(monument);
        reference3 = this.referenceRepository.save(reference3);

        monument.getReferences().add(reference3);

        List<Integer> deletedReferenceIds = new ArrayList<>();
        deletedReferenceIds.add(reference1.getId());
        deletedReferenceIds.add(reference2.getId());
        deletedReferenceIds.add(reference3.getId());

        this.monumentService.deleteMonumentReferences(monument, deletedReferenceIds);

        assertEquals(0, monument.getReferences().size());
        assertEquals(0, this.referenceRepository.findAll().size());
    }

    /* updateMonumentPrimaryImage Tests */

    @Test
    public void testMonumentService_updateMonumentPrimaryImage_NullMonument() {
        Monument monument = null;

        this.monumentService.updateMonumentPrimaryImage(monument, 1);

        assertNull(monument);
    }

    @Test
    public void testMonumentService_updateMonumentPrimaryImage_NullNewPrimaryImageId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image = new Image();
        image.setUrl("Image 1");
        image.setIsPrimary(true);
        image.setMonument(monument);
        this.imageRepository.save(image);

        monument.getImages().add(image);

        this.monumentService.updateMonumentPrimaryImage(monument, null);

        assertEquals(1, monument.getImages().size());
        assertEquals("Image 1", monument.getImages().get(0).getUrl());
        assertTrue(monument.getImages().get(0).getIsPrimary());
    }

    @Test
    public void testMonumentService_updateMonumentPrimaryImage_NoImageWithNewPrimaryImageId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image = new Image();
        image.setUrl("Image 1");
        image.setIsPrimary(true);
        image.setMonument(monument);
        this.imageRepository.save(image);

        monument.getImages().add(image);

        this.monumentService.updateMonumentPrimaryImage(monument, 30);

        assertEquals(1, monument.getImages().size());
        assertEquals("Image 1", monument.getImages().get(0).getUrl());
        assertTrue(monument.getImages().get(0).getIsPrimary());
    }

    @Test
    public void testMonumentService_updateMonumentPrimaryImage_ImageWithNewPrimaryImageIdIsAlreadyPrimaryImage() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image = new Image();
        image.setUrl("Image 1");
        image.setIsPrimary(true);
        image.setMonument(monument);
        this.imageRepository.save(image);

        monument.getImages().add(image);

        this.monumentService.updateMonumentPrimaryImage(monument, image.getId());

        assertEquals(1, monument.getImages().size());
        assertEquals("Image 1", monument.getImages().get(0).getUrl());
        assertTrue(monument.getImages().get(0).getIsPrimary());
    }

    @Test
    public void testMonumentService_updateMonumentPrimaryImage_NewPrimaryImage() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image = new Image();
        image.setUrl("Image 1");
        image.setIsPrimary(false);
        image.setMonument(monument);
        this.imageRepository.save(image);

        monument.getImages().add(image);

        this.monumentService.updateMonumentPrimaryImage(monument, image.getId());

        assertEquals(1, monument.getImages().size());
        assertEquals("Image 1", monument.getImages().get(0).getUrl());
        assertTrue(monument.getImages().get(0).getIsPrimary());
    }

    @Test
    public void testMonumentService_updateMonumentPrimaryImage_NewPrimaryImageOutOfThreeImages() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image1 = new Image();
        image1.setUrl("Image 1");
        image1.setIsPrimary(true);
        image1.setMonument(monument);
        this.imageRepository.save(image1);

        monument.getImages().add(image1);

        Image image2 = new Image();
        image2.setUrl("Image 2");
        image2.setIsPrimary(false);
        image2.setMonument(monument);
        this.imageRepository.save(image2);

        monument.getImages().add(image2);

        Image image3 = new Image();
        image3.setUrl("Image 3");
        image3.setIsPrimary(false);
        image3.setMonument(monument);
        this.imageRepository.save(image3);

        monument.getImages().add(image3);

        this.monumentService.updateMonumentPrimaryImage(monument, image3.getId());

        assertEquals(3, monument.getImages().size());
        assertFalse(monument.getImages().get(0).getIsPrimary());
        assertFalse(monument.getImages().get(1).getIsPrimary());
        assertTrue(monument.getImages().get(2).getIsPrimary());
    }

    /* deleteMonumentImages Tests */

    @Test
    public void testMonumentService_deleteMonumentImages_NullMonument() {
        Monument monument = null;

        this.monumentService.deleteMonumentImages(monument, new ArrayList<>());

        assertNull(monument);
    }

    @Test
    public void testMonumentService_deleteMonumentImages_NullDeletedImageIds() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image = new Image();
        image.setUrl("Image");
        image.setIsPrimary(true);
        image.setMonument(monument);
        image = this.imageRepository.save(image);

        monument.getImages().add(image);

        this.monumentService.deleteMonumentImages(monument, null);

        assertEquals(1, monument.getImages().size());
        assertEquals(1, this.imageRepository.findAll().size());
    }

    @Test
    public void testMonumentService_deleteMonumentImages_EmptyDeletedImageIds() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image = new Image();
        image.setUrl("Image");
        image.setIsPrimary(true);
        image.setMonument(monument);
        image = this.imageRepository.save(image);

        monument.getImages().add(image);

        this.monumentService.deleteMonumentImages(monument, new ArrayList<>());

        assertEquals(1, monument.getImages().size());
        assertEquals(1, this.imageRepository.findAll().size());
    }

    @Test
    public void testMonumentService_deleteMonumentImages_OneImageDeleted() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image = new Image();
        image.setUrl("Image");
        image.setIsPrimary(true);
        image.setMonument(monument);
        image = this.imageRepository.save(image);

        monument.getImages().add(image);

        List<Integer> deletedImageIds = new ArrayList<>();
        deletedImageIds.add(image.getId());

        this.monumentService.deleteMonumentImages(monument, deletedImageIds);

        assertEquals(0, monument.getImages().size());
        assertEquals(0, this.imageRepository.findAll().size());
    }

    @Test
    public void testMonumentService_deleteMonumentImages_TwoOfThreeImagesDeleted() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image1 = new Image();
        image1.setUrl("Image 1");
        image1.setIsPrimary(true);
        image1.setMonument(monument);
        image1 = this.imageRepository.save(image1);

        monument.getImages().add(image1);

        Image image2 = new Image();
        image2.setUrl("Image 2");
        image2.setIsPrimary(false);
        image2.setMonument(monument);
        image2 = this.imageRepository.save(image2);

        monument.getImages().add(image2);

        Image image3 = new Image();
        image3.setUrl("Image 3");
        image3.setIsPrimary(false);
        image3.setMonument(monument);
        image3 = this.imageRepository.save(image3);

        monument.getImages().add(image3);

        List<Integer> deletedImageIds = new ArrayList<>();
        deletedImageIds.add(image1.getId());
        deletedImageIds.add(image3.getId());

        this.monumentService.deleteMonumentImages(monument, deletedImageIds);

        assertEquals(1, monument.getImages().size());
        assertEquals(image2.getId(), monument.getImages().get(0).getId());
        assertEquals(1, this.imageRepository.findAll().size());
    }

    @Test
    public void testMonumentService_deleteMonumentImages_AllThreeImagesDeleted() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image1 = new Image();
        image1.setUrl("Image 1");
        image1.setIsPrimary(true);
        image1.setMonument(monument);
        image1 = this.imageRepository.save(image1);

        monument.getImages().add(image1);

        Image image2 = new Image();
        image2.setUrl("Image 2");
        image2.setIsPrimary(false);
        image2.setMonument(monument);
        image2 = this.imageRepository.save(image2);

        monument.getImages().add(image2);

        Image image3 = new Image();
        image3.setUrl("Image 3");
        image3.setIsPrimary(false);
        image3.setMonument(monument);
        image3 = this.imageRepository.save(image3);

        monument.getImages().add(image3);

        List<Integer> deletedImageIds = new ArrayList<>();
        deletedImageIds.add(image1.getId());
        deletedImageIds.add(image2.getId());
        deletedImageIds.add(image3.getId());

        this.monumentService.deleteMonumentImages(monument, deletedImageIds);

        assertEquals(0, monument.getImages().size());
        assertEquals(0, this.imageRepository.findAll().size());
    }

    /* resetMonumentPrimaryImage Tests */

    @Test
    public void testMonumentService_resetMonumentPrimaryImage_NullMonument() {
        Monument monument = null;

        this.monumentService.resetMonumentPrimaryImage(monument);

        assertNull(monument);
    }

    @Test
    public void testMonumentService_resetMonumentPrimaryImage_NullMonumentImages() {
        Monument monument = new Monument();
        monument.setImages(null);

        this.monumentService.resetMonumentPrimaryImage(monument);

        assertNull(monument.getImages());
    }

    @Test
    public void testMonumentService_resetMonumentPrimaryImage_EmptyMonumentImages() {
        Monument monument = new Monument();

        this.monumentService.resetMonumentPrimaryImage(monument);

        assertEquals(0, monument.getImages().size());
    }

    @Test
    public void testMonumentService_resetMonumentPrimaryImage_MonumentHasPrimaryImage() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image = new Image();
        image.setIsPrimary(true);
        image.setMonument(monument);
        image = this.imageRepository.save(image);

        monument.getImages().add(image);

        this.monumentService.resetMonumentPrimaryImage(monument);

        assertEquals(1, monument.getImages().size());
        assertTrue(monument.getImages().get(0).getIsPrimary());
        assertTrue(this.imageRepository.getOne(image.getId()).getIsPrimary());
    }

    @Test
    public void testMonumentService_resetMonumentPrimaryImage_MonumentHasPrimaryImage_MultipleImages() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image1 = new Image();
        image1.setIsPrimary(true);
        image1.setMonument(monument);
        image1 = this.imageRepository.save(image1);

        monument.getImages().add(image1);

        Image image2 = new Image();
        image2.setIsPrimary(false);
        image2.setMonument(monument);
        image2 = this.imageRepository.save(image2);

        monument.getImages().add(image2);

        Image image3 = new Image();
        image3.setIsPrimary(false);
        image3.setMonument(monument);
        image3 = this.imageRepository.save(image3);

        monument.getImages().add(image3);

        this.monumentService.resetMonumentPrimaryImage(monument);

        assertEquals(3, monument.getImages().size());
        assertTrue(monument.getImages().get(0).getIsPrimary());
        assertFalse(monument.getImages().get(1).getIsPrimary());
        assertFalse(monument.getImages().get(2).getIsPrimary());
        assertTrue(this.imageRepository.getOne(image1.getId()).getIsPrimary());
        assertFalse(this.imageRepository.getOne(image2.getId()).getIsPrimary());
        assertFalse(this.imageRepository.getOne(image3.getId()).getIsPrimary());
    }

    @Test
    public void testMonumentService_resetMonumentPrimaryImage_MonumentHasNoPrimaryImage() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image1 = new Image();
        image1.setIsPrimary(false);
        image1.setMonument(monument);
        image1 = this.imageRepository.save(image1);

        monument.getImages().add(image1);

        this.monumentService.resetMonumentPrimaryImage(monument);

        assertEquals(1, monument.getImages().size());
        assertTrue(monument.getImages().get(0).getIsPrimary());
        assertTrue(this.imageRepository.getOne(image1.getId()).getIsPrimary());
    }

    @Test
    public void testMonumentService_resetMonumentPrimaryImage_MonumentHasNoPrimaryImage_MultipleImages() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Image image1 = new Image();
        image1.setIsPrimary(false);
        image1.setMonument(monument);
        image1 = this.imageRepository.save(image1);

        monument.getImages().add(image1);

        Image image2 = new Image();
        image2.setIsPrimary(false);
        image2.setMonument(monument);
        image2 = this.imageRepository.save(image2);

        monument.getImages().add(image2);

        Image image3 = new Image();
        image3.setIsPrimary(false);
        image3.setMonument(monument);
        image3 = this.imageRepository.save(image3);

        monument.getImages().add(image3);

        this.monumentService.resetMonumentPrimaryImage(monument);

        assertEquals(3, monument.getImages().size());
        assertTrue(monument.getImages().get(0).getIsPrimary());
        assertFalse(monument.getImages().get(1).getIsPrimary());
        assertFalse(monument.getImages().get(2).getIsPrimary());
        assertTrue(this.imageRepository.getOne(image1.getId()).getIsPrimary());
        assertFalse(this.imageRepository.getOne(image2.getId()).getIsPrimary());
        assertFalse(this.imageRepository.getOne(image3.getId()).getIsPrimary());
    }
}