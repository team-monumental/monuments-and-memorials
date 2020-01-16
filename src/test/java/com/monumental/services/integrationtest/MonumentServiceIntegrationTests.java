package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
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
import java.util.ArrayList;
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
}
