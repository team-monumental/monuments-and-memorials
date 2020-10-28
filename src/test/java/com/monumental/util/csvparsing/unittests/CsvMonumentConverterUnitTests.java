package com.monumental.util.csvparsing.unittests;

import com.google.gson.Gson;
import com.monumental.models.DateFormat;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.services.integrationtest.MonumentServiceMockIntegrationTests;
import com.monumental.util.csvparsing.CsvMonumentConverter;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.*;

import static org.junit.Assert.*;

/**
 * Test class for unit testing CsvMonumentConverter
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class CsvMonumentConverterUnitTests {

    private Map<String, String> mapping = MonumentServiceMockIntegrationTests.mapping;

    /** convertCsvRow Tests **/

    @Test
    public void testCsvMonumentConverter_convertCsvRow_AllEmptyValues() {
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(",,,,,,,,,,,,,");

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(0, result.getContributorNames().size());
        assertEquals(0, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertNull(suggestionResult.getArtist());
        assertNull(suggestionResult.getTitle());
        assertNull(suggestionResult.getDate());
        assertNull(suggestionResult.getInscription());
        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());
        assertNull(suggestionResult.getCity());
        assertNull(suggestionResult.getState());
        assertNull(suggestionResult.getAddress());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(3, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getDate());
        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DateFormatYear() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-01-01T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.YEAR, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DateFormatDayMonthYear() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DateFormat_MonthYear() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-01T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.MONTH_YEAR, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DateFormat_MonthYear_Slashes() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,03/1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-01T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.MONTH_YEAR, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DateFormat_Slashes() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12/03/1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-12-03T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_InvalidDateFormat() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,December 3 1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(1, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DeactivatedDateFormatDayMonthYear() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,,13-03-1997";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("1997-03-13T00:00:00", suggestionResult.getDeactivatedDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDeactivatedDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DeactivatedDateFormatDayMonthYear_Slashes() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,,03/13/1997";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("1997-03-13T00:00:00", suggestionResult.getDeactivatedDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDeactivatedDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DeactivatedDateFormatMonthYear() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,,03-1997";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("1997-03-01T00:00:00", suggestionResult.getDeactivatedDate());
        assertEquals(DateFormat.MONTH_YEAR, suggestionResult.getDeactivatedDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DeactivatedDateFormatMonthYear_Slashes() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,,03/1997";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("1997-03-01T00:00:00", suggestionResult.getDeactivatedDate());
        assertEquals(DateFormat.MONTH_YEAR, suggestionResult.getDeactivatedDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DeactivatedDateFormatYear() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,,1997";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("1997-01-01T00:00:00", suggestionResult.getDeactivatedDate());
        assertEquals(DateFormat.YEAR, suggestionResult.getDeactivatedDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DeactivatedDateFormatInvalid() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,,June 1997";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(1, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DeactivatedDateBeforeCreatedDate_Invalid() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,,11-03-1997";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("1997-03-11T00:00:00", suggestionResult.getDeactivatedDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDeactivatedDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(1, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_WithDeactivatedComment() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,,13-03-1997,Deactivated Comment";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("1997-03-13T00:00:00", suggestionResult.getDeactivatedDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDeactivatedDateFormat());
        assertEquals("Deactivated Comment", suggestionResult.getDeactivatedComment());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_WithDeactivatedComment_NoDeactivatedDate_Invalid() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,,,Deactivated Comment";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Deactivated Comment", suggestionResult.getDeactivatedComment());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(1, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_Materials() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Metal, Bronze\",Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertEquals(2, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, result.getWarnings().size());
        assertEquals(1, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_Tags() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertEquals(0, materialNameResults.size());
        assertEquals(3, tagNameResults.size());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_MaterialsAndTags() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,,,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertEquals(2, materialNameResults.size());
        assertEquals(3, tagNameResults.size());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, result.getWarnings().size());
        assertEquals(1, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_LatitudeAndLongitude() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,40.730610,-73.935242,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals(40.730610, suggestionResult.getLatitude(), 0.0);
        assertEquals(-73.935242, suggestionResult.getLongitude(), 0.0);
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertEquals(2, materialNameResults.size());
        assertEquals(3, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(1, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_InvalidLatitudeAndLongitude_NotValidNumbers() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,lat,lon,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(2, materialNameResults.size());
        assertEquals(3, tagNameResults.size());

        assertEquals(2, result.getWarnings().size());
        assertEquals(1, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_InvalidLatitudeAndLongitude_DegreesFormat() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,40.730°,-73.935°,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(2, materialNameResults.size());
        assertEquals(3, tagNameResults.size());

        assertEquals(1, result.getWarnings().size());
        assertEquals(1, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_InvalidLatitudeAndLongitude_NotNearTheUS() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,73.000,-62.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("1997-03-12T00:00:00", suggestionResult.getDate());
        assertEquals(DateFormat.EXACT_DATE, suggestionResult.getDateFormat());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertEquals(73.000, suggestionResult.getLatitude(), 0.0);
        assertEquals(-62.000, suggestionResult.getLongitude(), 0.0);

        assertEquals(2, materialNameResults.size());
        assertEquals(3, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(3, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_Image_CsvRowFromZipFile() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,Test Image";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getDate());
        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(1, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_Image_CsvRowNotFromZipFile() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,TestImage.jpg";
        List<String[]> csvList = MonumentServiceMockIntegrationTests.parseCSVString(csvRow);

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRows(csvList, mapping, null).get(0);
        CreateMonumentSuggestion suggestionResult = result.getMonumentSuggestion();
        Set<String> materialNameResults = result.getMaterialNames();
        Set<String> tagNameResults = result.getTagNames();

        assertEquals(1, result.getContributorNames().size());
        assertEquals(1, result.getReferenceUrls().size());
        assertEquals(0, result.getImageFiles().size());

        assertEquals("Test Artist", suggestionResult.getArtist());
        assertEquals("Test Title", suggestionResult.getTitle());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertNull(suggestionResult.getDate());
        assertNull(suggestionResult.getLatitude());
        assertNull(suggestionResult.getLongitude());

        assertEquals(0, materialNameResults.size());
        assertEquals(0, tagNameResults.size());

        assertEquals(1, result.getWarnings().size());
        assertEquals(2, result.getErrors().size());
    }

    /* cleanTagName Tests */

    @Test
    public void testCsvMonumentConverter_cleanTagName_NullTagName() {
        assertNull(CsvMonumentConverter.cleanTagName(null));
    }

    @Test
    public void testCsvMonumentConverter_cleanTagName_EmptyTagName() {
        String result = CsvMonumentConverter.cleanTagName("");

        assertEquals("", result);
    }

    @Test
    public void testCsvMonumentConverter_cleanTagName_WhitespaceInTagName() {
        String result = CsvMonumentConverter.cleanTagName("  Test  \n");

        assertEquals("Test", result);
    }

    @Test
    public void testCsvMonumentConverter_cleanTagName_UncapitalizedTagName() {
        String result = CsvMonumentConverter.cleanTagName("test");

        assertEquals("Test", result);
    }

    @Test
    public void testCsvMonumentConverter_cleanTagName_UncapitalizedTagNameWithWhitespace() {
        String result = CsvMonumentConverter.cleanTagName("  test  \n\r");

        assertEquals("Test", result);
    }

    /** parseCsvMonumentConverterResult Tests **/

    @Test
    public void testCsvMonumentConverter_parseCsvMonumentConverterResult_NullCsvMonumentConverterResult() {
        assertNull(CsvMonumentConverter.parseCsvMonumentConverterResult(null, new Gson()));
    }

    @Test
    public void testCsvMonumentConverter_parseCsvMonumentConverterResult_NullMonumentSuggestion() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        result.setMonumentSuggestion(null);

        assertNull(CsvMonumentConverter.parseCsvMonumentConverterResult(result, new Gson()));
    }

    @Test
    public void testCsvMonumentConverter_parseCsvMonumentConverterResult_NullGson() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        result.setMonumentSuggestion(new CreateMonumentSuggestion());

        assertNull(CsvMonumentConverter.parseCsvMonumentConverterResult(result, null));
    }

    @Test
    public void testCsvMonumentConverter_parseCsvMonumentConverterResult_VariousValues() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        result.setMonumentSuggestion(new CreateMonumentSuggestion());

        List<String> contributorNames = new ArrayList<>();
        contributorNames.add("Contributor 1");
        contributorNames.add("Contributor 2");
        contributorNames.add("Contributor 3");
        result.setContributorNames(contributorNames);

        List<String> referenceUrls = new ArrayList<>();
        referenceUrls.add("Reference URL 1");
        referenceUrls.add("Reference URL 2");
        result.setReferenceUrls(referenceUrls);

        Set<String> tagNames = new HashSet<>();
        tagNames.add("Tag 1");
        result.setTagNames(tagNames);

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material 1");
        materialNames.add("Material 2");
        materialNames.add("Material 3");
        materialNames.add("Material 4");
        result.setMaterialNames(materialNames);

        CreateMonumentSuggestion suggestionResult = CsvMonumentConverter.parseCsvMonumentConverterResult(result, new Gson());

        assertEquals("[\"Contributor 1\",\"Contributor 2\",\"Contributor 3\"]", suggestionResult.getContributionsJson());
        assertEquals("[\"Reference URL 1\",\"Reference URL 2\"]", suggestionResult.getReferencesJson());
        assertEquals("[\"Tag 1\"]", suggestionResult.getTagsJson());
        assertEquals("[\"Material 1\",\"Material 2\",\"Material 3\",\"Material 4\"]", suggestionResult.getMaterialsJson());
    }
}
