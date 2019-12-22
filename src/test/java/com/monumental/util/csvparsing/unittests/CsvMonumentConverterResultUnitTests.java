package com.monumental.util.csvparsing.unittests;

import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.models.Tag;
import com.monumental.services.MonumentService;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import com.vividsolutions.jts.geom.Point;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Test class for unit testing CsvMonumentConverterResult
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class CsvMonumentConverterResultUnitTests {

    /** validate Tests **/

    @Test(expected = IllegalArgumentException.class)
    public void testCsvMonumentConverterResult_validate_NullMonument() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        result.validate();
    }

    @Test
    public void testCsvMonumentConverterResult_validate_AllNullFields() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        result.setMonument(new Monument());

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(3, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("Title is required"));
        assertTrue(validationResult.getValidationErrors().contains("At least one Material is required"));
        assertTrue(validationResult.getValidationErrors().contains("Address OR Coordinates are required"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_NonNullTitle() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(2, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("At least one Material is required"));
        assertTrue(validationResult.getValidationErrors().contains("Address OR Coordinates are required"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_Materials() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(1, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("Address OR Coordinates are required"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_AllRequiredFields_Address() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        monument.setAddress("Address");

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertTrue(validationResult.isValid());

        assertEquals(0, validationResult.getValidationErrors().size());
    }

    @Test
    public void testCsvMonumentConverterResult_validate_AllRequiredFields_Coordinates() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        Point coordinates = MonumentService.createMonumentPoint(180.000, 90.000);
        monument.setCoordinates(coordinates);

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertTrue(validationResult.isValid());

        assertEquals(0, validationResult.getValidationErrors().size());
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidLatitude() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        Point coordinates = MonumentService.createMonumentPoint(180.000, 91.000);
        monument.setCoordinates(coordinates);

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(1, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("Latitude must be valid"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidLongitude() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        Point coordinates = MonumentService.createMonumentPoint(181.000, 90.000);
        monument.setCoordinates(coordinates);

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(1, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("Longitude must be valid"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidLatitudeAndLongitude() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        Point coordinates = MonumentService.createMonumentPoint(181.000, 91.000);
        monument.setCoordinates(coordinates);

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(2, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("Latitude must be valid"));
        assertTrue(validationResult.getValidationErrors().contains("Longitude must be valid"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidDate_FutureYear() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        monument.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear + 1, currentMonth, currentDay);

        monument.setDate(calendar.getTime());

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(1, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("Date must be valid"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidDate_FutureMonth() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        monument.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth + 1, currentDay);

        monument.setDate(calendar.getTime());

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(1, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("Date must be valid"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidDate_FutureDay() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        monument.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth, currentDay + 1);

        monument.setDate(calendar.getTime());

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(1, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("Date must be valid"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_ValidDate() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        monument.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth, currentDay - 3);

        monument.setDate(calendar.getTime());

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertTrue(validationResult.isValid());

        assertEquals(0, validationResult.getValidationErrors().size());
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidReference() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        monument.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth, currentDay - 3);

        monument.setDate(calendar.getTime());

        Reference reference = new Reference();
        reference.setUrl("Test");

        monument.getReferences().add(reference);

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(1, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("All References must be valid URLs"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_InvalidReferences() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        monument.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth, currentDay - 3);

        monument.setDate(calendar.getTime());

        Reference reference1 = new Reference();
        reference1.setUrl("Test");

        Reference reference2 = new Reference();
        reference2.setUrl("http://test.com");

        Reference reference3 = new Reference();
        reference3.setUrl("Test 2");

        monument.getReferences().add(reference1);
        monument.getReferences().add(reference2);
        monument.getReferences().add(reference3);

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertFalse(validationResult.isValid());

        assertEquals(1, validationResult.getValidationErrors().size());
        assertTrue(validationResult.getValidationErrors().contains("All References must be valid URLs"));
    }

    @Test
    public void testCsvMonumentConverterResult_validate_ValidReferences() {
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<Tag> materials = new ArrayList<>();

        Tag material = new Tag();
        material.setName("Material");
        material.setIsMaterial(true);

        materials.add(material);
        result.setMaterials(materials);

        monument.setAddress("Address");

        GregorianCalendar calendar = new GregorianCalendar();
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        int currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
        calendar.set(currentYear, currentMonth, currentDay - 3);

        monument.setDate(calendar.getTime());

        Reference reference1 = new Reference();
        reference1.setUrl("https://test.org");

        Reference reference2 = new Reference();
        reference2.setUrl("http://test.com");

        monument.getReferences().add(reference1);
        monument.getReferences().add(reference2);

        result.setMonument(monument);

        CsvMonumentConverterResult.ValidationResult validationResult = result.validate();

        assertTrue(validationResult.isValid());

        assertEquals(0, validationResult.getValidationErrors().size());
    }
}
