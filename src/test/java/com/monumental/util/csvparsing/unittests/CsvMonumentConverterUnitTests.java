package com.monumental.util.csvparsing.unittests;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.util.csvparsing.CsvMonumentConverter;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Test class for unit testing CsvMonumentConverter
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class CsvMonumentConverterUnitTests {

    /** convertCsvRow Tests **/

    @Test
    public void testCsvMonumentConverter_convertCsvRow_NullCsvRow() {
        assertNull(CsvMonumentConverter.convertCsvRow(null));
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCsvMonumentConverter_convertCsvRow_InvalidCsvLength_TooShort() {
        String csvRow = "1,2,3,4,5,6,7,8,9";

        CsvMonumentConverter.convertCsvRow(csvRow);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCsvMonumentConverter_convertCsvRow_InvalidCsvLength_TooLong() {
        String csvRow = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15";

        CsvMonumentConverter.convertCsvRow(csvRow);
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_AllEmptyValues() {
        String csvRow = ",,,,,,,,,,,,,";

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow);
        Monument monumentResult = result.getMonument();
        List<Tag> materialResults = result.getMaterials();
        List<Tag> tagResults = result.getTags();

        assertEquals(0, monumentResult.getContributions().size());
        assertEquals(0, monumentResult.getReferences().size());

        assertNull(monumentResult.getArtist());
        assertNull(monumentResult.getTitle());
        assertNull(monumentResult.getDate());
        assertNull(monumentResult.getInscription());
        assertNull(monumentResult.getLat());
        assertNull(monumentResult.getLon());
        assertNull(monumentResult.getCoordinates());
        assertNull(monumentResult.getCity());
        assertNull(monumentResult.getState());
        assertNull(monumentResult.getAddress());

        assertNull(materialResults);
        assertNull(tagResults);
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow);
        Monument monumentResult = result.getMonument();
        List<Tag> materialResults = result.getMaterials();
        List<Tag> tagResults = result.getTags();

        assertEquals(1, monumentResult.getContributions().size());
        assertEquals(1, monumentResult.getReferences().size());

        assertEquals("Test Artist", monumentResult.getArtist());
        assertEquals("Test Title", monumentResult.getTitle());
        assertEquals("Test Inscription", monumentResult.getInscription());
        assertEquals("Test City", monumentResult.getCity());
        assertEquals("Test State", monumentResult.getState());
        assertEquals("Test Address", monumentResult.getAddress());

        assertNull(monumentResult.getDate());
        assertNull(monumentResult.getLat());
        assertNull(monumentResult.getLon());
        assertNull(monumentResult.getCoordinates());

        assertNull(materialResults);
        assertNull(tagResults);
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DateFormatYear() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow);
        Monument monumentResult = result.getMonument();
        List<Tag> materialResults = result.getMaterials();
        List<Tag> tagResults = result.getTags();

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.set(1997, Calendar.JANUARY, 1);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String expectedDateString = simpleDateFormat.format(calendar.getTime());

        assertEquals(1, monumentResult.getContributions().size());
        assertEquals(1, monumentResult.getReferences().size());

        assertEquals("Test Artist", monumentResult.getArtist());
        assertEquals("Test Title", monumentResult.getTitle());
        assertEquals(expectedDateString, simpleDateFormat.format(monumentResult.getDate()));
        assertEquals("Test Inscription", monumentResult.getInscription());
        assertEquals("Test City", monumentResult.getCity());
        assertEquals("Test State", monumentResult.getState());
        assertEquals("Test Address", monumentResult.getAddress());

        assertNull(monumentResult.getLat());
        assertNull(monumentResult.getLon());
        assertNull(monumentResult.getCoordinates());

        assertNull(materialResults);
        assertNull(tagResults);
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DateFormatDayMonthYear() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow);
        Monument monumentResult = result.getMonument();
        List<Tag> materialResults = result.getMaterials();
        List<Tag> tagResults = result.getTags();

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.set(1997, Calendar.MARCH, 12);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String expectedDateString = simpleDateFormat.format(calendar.getTime());

        assertEquals(1, monumentResult.getContributions().size());
        assertEquals(1, monumentResult.getReferences().size());

        assertEquals("Test Artist", monumentResult.getArtist());
        assertEquals("Test Title", monumentResult.getTitle());
        assertEquals(expectedDateString, simpleDateFormat.format(monumentResult.getDate()));
        assertEquals("Test Inscription", monumentResult.getInscription());
        assertEquals("Test City", monumentResult.getCity());
        assertEquals("Test State", monumentResult.getState());
        assertEquals("Test Address", monumentResult.getAddress());

        assertNull(monumentResult.getLat());
        assertNull(monumentResult.getLon());
        assertNull(monumentResult.getCoordinates());

        assertNull(materialResults);
        assertNull(tagResults);
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_DateFormatInvalid() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,03-1997,,Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow);
        Monument monumentResult = result.getMonument();
        List<Tag> materialResults = result.getMaterials();
        List<Tag> tagResults = result.getTags();

        assertEquals(1, monumentResult.getContributions().size());
        assertEquals(1, monumentResult.getReferences().size());

        assertEquals("Test Artist", monumentResult.getArtist());
        assertEquals("Test Title", monumentResult.getTitle());
        assertEquals("Test Inscription", monumentResult.getInscription());
        assertEquals("Test City", monumentResult.getCity());
        assertEquals("Test State", monumentResult.getState());
        assertEquals("Test Address", monumentResult.getAddress());

        assertNull(monumentResult.getDate());
        assertNull(monumentResult.getLat());
        assertNull(monumentResult.getLon());
        assertNull(monumentResult.getCoordinates());

        assertNull(materialResults);
        assertNull(tagResults);
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_Materials() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Metal, Bronze\",Test Inscription,,,Test City,Test State,Test Address,,Test Reference,";

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow);
        Monument monumentResult = result.getMonument();
        List<Tag> materialResults = result.getMaterials();
        List<Tag> tagResults = result.getTags();

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.set(1997, Calendar.MARCH, 12);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String expectedDateString = simpleDateFormat.format(calendar.getTime());

        assertEquals(1, monumentResult.getContributions().size());
        assertEquals(1, monumentResult.getReferences().size());

        assertEquals("Test Artist", monumentResult.getArtist());
        assertEquals("Test Title", monumentResult.getTitle());
        assertEquals(expectedDateString, simpleDateFormat.format(monumentResult.getDate()));
        assertEquals("Test Inscription", monumentResult.getInscription());
        assertEquals("Test City", monumentResult.getCity());
        assertEquals("Test State", monumentResult.getState());
        assertEquals("Test Address", monumentResult.getAddress());

        assertEquals(2, materialResults.size());
        assertEquals(0, tagResults.size());

        assertNull(monumentResult.getLat());
        assertNull(monumentResult.getLon());
        assertNull(monumentResult.getCoordinates());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_Tags() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,,Test Inscription,,,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow);
        Monument monumentResult = result.getMonument();
        List<Tag> materialResults = result.getMaterials();
        List<Tag> tagResults = result.getTags();

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.set(1997, Calendar.MARCH, 12);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String expectedDateString = simpleDateFormat.format(calendar.getTime());

        assertEquals(1, monumentResult.getContributions().size());
        assertEquals(1, monumentResult.getReferences().size());

        assertEquals("Test Artist", monumentResult.getArtist());
        assertEquals("Test Title", monumentResult.getTitle());
        assertEquals(expectedDateString, simpleDateFormat.format(monumentResult.getDate()));
        assertEquals("Test Inscription", monumentResult.getInscription());
        assertEquals("Test City", monumentResult.getCity());
        assertEquals("Test State", monumentResult.getState());
        assertEquals("Test Address", monumentResult.getAddress());

        assertEquals(0, materialResults.size());
        assertEquals(3, tagResults.size());

        assertNull(monumentResult.getLat());
        assertNull(monumentResult.getLon());
        assertNull(monumentResult.getCoordinates());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_MaterialsAndTags() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,,,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow);
        Monument monumentResult = result.getMonument();
        List<Tag> materialResults = result.getMaterials();
        List<Tag> tagResults = result.getTags();

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.set(1997, Calendar.MARCH, 12);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String expectedDateString = simpleDateFormat.format(calendar.getTime());

        assertEquals(1, monumentResult.getContributions().size());
        assertEquals(1, monumentResult.getReferences().size());

        assertEquals("Test Artist", monumentResult.getArtist());
        assertEquals("Test Title", monumentResult.getTitle());
        assertEquals(expectedDateString, simpleDateFormat.format(monumentResult.getDate()));
        assertEquals("Test Inscription", monumentResult.getInscription());
        assertEquals("Test City", monumentResult.getCity());
        assertEquals("Test State", monumentResult.getState());
        assertEquals("Test Address", monumentResult.getAddress());

        assertEquals(2, materialResults.size());
        assertEquals(3, tagResults.size());

        assertNull(monumentResult.getLat());
        assertNull(monumentResult.getLon());
        assertNull(monumentResult.getCoordinates());
    }

    @Test
    public void testCsvMonumentConverter_convertCsvRow_VariousValues_LatitudeAndLongitude() {
        String csvRow = "Test Submitted By,Test Artist,Test Title,12-03-1997,\"Material 1, Material 2\",Test Inscription,90.000,180.000,Test City,Test State,Test Address,\"Tag 1, Tag 2, Tag 3\",Test Reference,";

        CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow);
        Monument monumentResult = result.getMonument();
        List<Tag> materialResults = result.getMaterials();
        List<Tag> tagResults = result.getTags();

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.set(1997, Calendar.MARCH, 12);

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String expectedDateString = simpleDateFormat.format(calendar.getTime());

        assertEquals(1, monumentResult.getContributions().size());
        assertEquals(1, monumentResult.getReferences().size());

        assertEquals("Test Artist", monumentResult.getArtist());
        assertEquals("Test Title", monumentResult.getTitle());
        assertEquals(expectedDateString, simpleDateFormat.format(monumentResult.getDate()));
        assertEquals("Test Inscription", monumentResult.getInscription());
        assertEquals(90.000, monumentResult.getLat(), 0.0);
        assertEquals(180.000, monumentResult.getLon(), 0.0);
        assertNotNull(monumentResult.getCoordinates());
        assertEquals("Test City", monumentResult.getCity());
        assertEquals("Test State", monumentResult.getState());
        assertEquals("Test Address", monumentResult.getAddress());

        assertEquals(2, materialResults.size());
        assertEquals(3, tagResults.size());
    }
}