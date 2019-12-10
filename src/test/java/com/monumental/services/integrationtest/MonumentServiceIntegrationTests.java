package com.monumental.services.integrationtest;

import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.TagRepository;
import com.monumental.services.MonumentService;
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

    /** bulkCreateMonumentsFromCsv Tests **/

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_NullCsvList() {
        assertNull(this.monumentService.bulkCreateMonumentsFromCsv(null));
    }

    @Test
    public void testMonumentService_bulkCreateMonumentsFromCsv_EmptyCsvList() {
        List<String> csvList = new ArrayList<>();

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList);

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

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList);

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

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList);

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

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList);

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

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList);

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

        BulkCreateResult result = this.monumentService.bulkCreateMonumentsFromCsv(csvList);

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
}
