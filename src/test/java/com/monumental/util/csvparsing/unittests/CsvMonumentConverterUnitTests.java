package com.monumental.util.csvparsing.unittests;

import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.services.integrationtest.MonumentServiceMockIntegrationTests;
import com.monumental.util.csvparsing.CsvMonumentConverter;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.text.SimpleDateFormat;
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
        assertEquals("1997", suggestionResult.getDate());
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
        assertEquals("12-03-1997", suggestionResult.getDate());
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
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_InvalidDateFormat_MonthYear() {
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
        assertEquals("03-1997", suggestionResult.getDate());
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
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_InvalidDateFormat_Slashes() {
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
        assertEquals("12/03/1997", suggestionResult.getDate());
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
        assertEquals("12-03-1997", suggestionResult.getDate());
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
        assertEquals("12-03-1997", suggestionResult.getDate());
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
        assertEquals("12-03-1997", suggestionResult.getDate());
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
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";
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
        assertEquals("12-03-1997", suggestionResult.getDate());
        assertEquals("Test Inscription", suggestionResult.getInscription());
        assertEquals(90.000, suggestionResult.getLatitude(), 0.0);
        assertEquals(180.000, suggestionResult.getLongitude(), 0.0);
        assertEquals("Test City", suggestionResult.getCity());
        assertEquals("Test State", suggestionResult.getState());
        assertEquals("Test Address", suggestionResult.getAddress());

        assertEquals(2, materialNameResults.size());
        assertEquals(3, tagNameResults.size());

        assertEquals(0, result.getWarnings().size());
        assertEquals(1, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_InvalidLatitudeAndLongitude() {
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
        assertEquals("12-03-1997", suggestionResult.getDate());
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
}
