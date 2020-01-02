package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.models.api.MonumentAboutPageStatistics;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.TagRepository;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import com.monumental.util.csvparsing.BulkCreateResult;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.transaction.Transactional;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    /** bulkCreateMonumentsFromCsv Tests **/

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_NullCsvList() {
        assertNull(this.monumentService.bulkCreateMonumentsFromCsv(null, false, null, null));
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_EmptyCsvList() {
        List<String> csvList = new ArrayList<>();

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList, false, null, null);

        assertEquals(0, result.getValidMonumentRecords().size());
        assertEquals(0, result.getInvalidCsvMonumentRecordsByRowNumber().size());
        assertEquals(0, result.getInvalidCsvMonumentRecordErrorsByRowNumber().size());
        assertEquals(0, result.getMonumentsInsertedCount().intValue());
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_OneInvalidCsvRecord() {
        List<String> csvList = new ArrayList<>();

        String csvRow = "Test Submitted By,Test Artist,,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
        csvList.add(csvRow);

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList, false, null, null);

        assertEquals(0, result.getValidMonumentRecords().size());

        assertEquals(1, result.getInvalidCsvMonumentRecordsByRowNumber().size());
        assertEquals(1, result.getInvalidCsvMonumentRecordErrorsByRowNumber().size());

        List<String> validationErrors = result.getInvalidCsvMonumentRecordErrorsByRowNumber().get(1);
        assertEquals(2, validationErrors.size());
        assertTrue(validationErrors.contains("Title is required"));
        assertTrue(validationErrors.contains("All References must be valid URLs"));

        assertEquals(0, result.getMonumentsInsertedCount().intValue());
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_OneValidRecord() {
        List<String> csvList = new ArrayList<>();

        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";
        csvList.add(csvRow);

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList, false, null, null);

        assertEquals(1, result.getValidMonumentRecords().size());
        assertEquals(0, result.getInvalidCsvMonumentRecordsByRowNumber().size());
        assertEquals(0, result.getInvalidCsvMonumentRecordErrorsByRowNumber().size());

        assertEquals(1, result.getMonumentsInsertedCount().intValue());
        assertEquals(1, this.monumentRepository.findAll().size());

        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());

        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_TwoInvalidCsvRecords() {
        List<String> csvList = new ArrayList<>();

        String csvRow1 = "Test Submitted By,Test Artist,,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
        String csvRow2 = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",,";

        csvList.add(csvRow1);
        csvList.add(csvRow2);

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList, false, null, null);

        assertEquals(0, result.getValidMonumentRecords().size());

        assertEquals(2, result.getInvalidCsvMonumentRecordsByRowNumber().size());
        assertEquals(2, result.getInvalidCsvMonumentRecordErrorsByRowNumber().size());

        List<String> validationErrorsRow1 = result.getInvalidCsvMonumentRecordErrorsByRowNumber().get(1);
        assertEquals(2, validationErrorsRow1.size());
        assertTrue(validationErrorsRow1.contains("Title is required"));
        assertTrue(validationErrorsRow1.contains("All References must be valid URLs"));

        List<String> validationErrorsRow2 = result.getInvalidCsvMonumentRecordErrorsByRowNumber().get(2);
        assertEquals(1, validationErrorsRow2.size());
        assertTrue(validationErrorsRow2.contains("At least one Material is required"));

        assertEquals(0, result.getMonumentsInsertedCount().intValue());
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_TwoValidRecords() {
        List<String> csvList = new ArrayList<>();

        String csvRow1 = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";
        String csvRow2 = ",Test Artist,Test Title,,\"Material 1, Material 2\",,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";

        csvList.add(csvRow1);
        csvList.add(csvRow2);

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList, false, null, null);

        assertEquals(2, result.getValidMonumentRecords().size());
        assertEquals(0, result.getInvalidCsvMonumentRecordsByRowNumber().size());
        assertEquals(0, result.getInvalidCsvMonumentRecordErrorsByRowNumber().size());

        assertEquals(2, result.getMonumentsInsertedCount().intValue());
        assertEquals(2, this.monumentRepository.findAll().size());

        assertEquals(3, this.tagRepository.getAllByIsMaterial(false).size());

        assertEquals(2, this.tagRepository.getAllByIsMaterial(true).size());
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_MixedValidAndInvalidRows() {
        List<String> csvList = new ArrayList<>();

        String csvRow1 = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";
        String csvRow2 = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,93.000,184.000,Test City,Test State,,\"Tag 1, Tag 2, Tag 3\",http://test.com,";
        String csvRow3 = ",Test Artist,Test Title,,\"Material 1, Material 2\",,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";
        String csvRow4 = ",Test Artist,,,,,,,,,Test Address,\"Tag 1, Tag 2, Tag 3\",http://test.com,";

        csvList.add(csvRow1);
        csvList.add(csvRow2);
        csvList.add(csvRow3);
        csvList.add(csvRow4);

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList, false, null, null);

        assertEquals(2, result.getValidMonumentRecords().size());

        assertEquals(2, result.getInvalidCsvMonumentRecordsByRowNumber().size());
        assertEquals(2, result.getInvalidCsvMonumentRecordErrorsByRowNumber().size());

        List<String> validationErrorsRow2 = result.getInvalidCsvMonumentRecordErrorsByRowNumber().get(2);
        assertEquals(2, validationErrorsRow2.size());
        assertTrue(validationErrorsRow2.contains("Latitude must be valid"));
        assertTrue(validationErrorsRow2.contains("Longitude must be valid"));

        List<String> validationErrorsRow4 = result.getInvalidCsvMonumentRecordErrorsByRowNumber().get(4);
        assertEquals(2, validationErrorsRow4.size());
        assertTrue(validationErrorsRow4.contains("Title is required"));
        assertTrue(validationErrorsRow4.contains("At least one Material is required"));

        assertEquals(2, result.getMonumentsInsertedCount().intValue());
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
}
