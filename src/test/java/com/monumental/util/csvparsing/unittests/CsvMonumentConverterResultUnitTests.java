package com.monumental.util.csvparsing.unittests;

import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.services.MonumentService;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import com.vividsolutions.jts.geom.Point;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Test class for unit testing CsvMonumentConverterResult
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class CsvMonumentConverterResultUnitTests {

    /** validate Tests **/

    @Test
    public void testCsvMonumentConverterResult_validate_AllNullFields() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        result.setMonumentSuggestion(new CreateMonumentSuggestion());
        result.validate();

        assertEquals(3, result.getErrors().size());
        assertTrue(result.getErrors().contains("Title is required"));
        assertTrue(result.getErrors().contains("At least one Material is required"));
        assertTrue(result.getErrors().contains("Address OR Coordinates are required"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_NonNullTitle() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(2, result.getErrors().size());
        assertTrue(result.getErrors().contains("At least one Material is required"));
        assertTrue(result.getErrors().contains("Address OR Coordinates are required"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_Materials() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(1, result.getErrors().size());
        assertTrue(result.getErrors().contains("Address OR Coordinates are required"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_AllRequiredFields_Address() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setAddress("Address");

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(0, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverterResult_validate_AllRequiredFields_Coordinates() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setLongitude(180.000);
        suggestion.setLatitude(90.000);

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(0, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidLatitude() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setLongitude(180.000);
        suggestion.setLatitude(91.000);

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(1, result.getErrors().size());
        assertTrue(result.getErrors().contains("Latitude must be valid"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidLongitude() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setLongitude(181.000);
        suggestion.setLatitude(90.000);

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(1, result.getErrors().size());
        assertTrue(result.getErrors().contains("Longitude must be valid"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidLatitudeAndLongitude() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setLongitude(181.000);
        suggestion.setLatitude(91.000);

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(2, result.getErrors().size());
        assertTrue(result.getErrors().contains("Latitude must be valid"));
        assertTrue(result.getErrors().contains("Longitude must be valid"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidDate_FutureYear() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear + 1, currentMonth, currentDay);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");

        suggestion.setDate(simpleDateFormat.format(calendar.getTime()));

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(1, result.getWarnings().size());
        assertTrue(result.getWarnings().contains("Date should not be in the future."));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidDate_FutureMonth() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth + 1, currentDay);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");

        suggestion.setDate(simpleDateFormat.format(calendar.getTime()));

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(1, result.getWarnings().size());
        assertTrue(result.getWarnings().contains("Date should not be in the future."));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidDate_FutureDay() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth, currentDay + 1);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");

        suggestion.setDate(simpleDateFormat.format(calendar.getTime()));

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(1, result.getWarnings().size());
        assertTrue(result.getWarnings().contains("Date should not be in the future."));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_ValidDate() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth, currentDay - 3);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");

        suggestion.setDate(simpleDateFormat.format(calendar.getTime()));

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(0, result.getErrors().size());
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidReference() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth, currentDay - 3);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");

        suggestion.setDate(simpleDateFormat.format(calendar.getTime()));

        suggestion.getReferences().add("Test");

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(1, result.getErrors().size());
        assertTrue(result.getErrors().contains("All References must be valid URLs"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidReferences() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth, currentDay - 3);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");

        suggestion.setDate(simpleDateFormat.format(calendar.getTime()));

        Reference reference1 = new Reference();
        reference1.setUrl("Test");

        Reference reference2 = new Reference();
        reference2.setUrl("http://test.com");

        Reference reference3 = new Reference();
        reference3.setUrl("Test 2");

        suggestion.getReferences().add("Test");
        suggestion.getReferences().add("http://test.com");
        suggestion.getReferences().add("Test 2");

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(1, result.getErrors().size());
        assertTrue(result.getErrors().contains("All References must be valid URLs"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_ValidReferences() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
        suggestion.setTitle("Title");

        Set<String> materialNames = new HashSet<>();
        materialNames.add("Material");
        result.setMaterialNames(materialNames);

        suggestion.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth, currentDay - 3);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");

        suggestion.setDate(simpleDateFormat.format(calendar.getTime()));

        Reference reference1 = new Reference();
        reference1.setUrl("https://test.org");

        Reference reference2 = new Reference();
        reference2.setUrl("http://test.com");

        suggestion.getReferences().add("https://test.org");
        suggestion.getReferences().add("http://test.com");

        result.setMonumentSuggestion(suggestion);
        result.validate();

        assertEquals(0, result.getErrors().size());
    }
}
