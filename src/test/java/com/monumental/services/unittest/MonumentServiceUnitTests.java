package com.monumental.services.unittest;

import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.services.MonumentService;
import com.vividsolutions.jts.geom.Point;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.*;

import static com.monumental.services.MonumentService.coordinateSrid;
import static org.junit.Assert.*;

/**
 * Test class for unit testing MonumentService
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class MonumentServiceUnitTests {

    @Autowired
    MonumentService monumentService;

    /* createMonumentPoint Tests */

    @Test
    public void testMonumentService_createMonumentPoint_NullLongitude() {
        assertNull(MonumentService.createMonumentPoint(null, -130.0));
    }

    @Test
    public void testMonumentService_createMonumentPoint_NullLatitude() {
        assertNull(MonumentService.createMonumentPoint(43.0, null));
    }

    @Test
    public void testMonumentService_createMonumentPoint_ValidPointCreated() {
        Point result = MonumentService.createMonumentPoint(43.0, -73.0);

        assertEquals(coordinateSrid, result.getSRID());
        assertEquals(43.0, result.getX(), 0.0);
        assertEquals(-73.0, result.getY(), 0.0);
    }

    /* createMonumentDate Tests */

    @Test
    public void testMonumentService_createMonumentDate_NullYear() {
        assertNull(MonumentService.createMonumentDate(null));
    }

    @Test
    public void testMonumentService_createMonumentDate_ValidYear() {
        Date result = MonumentService.createMonumentDate("2013");

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(result);

        assertEquals(2013, calendar.get(Calendar.YEAR));
        assertEquals(0, calendar.get(Calendar.MONTH));
        assertEquals(1, calendar.get(Calendar.DAY_OF_MONTH));
    }

    @Test
    public void testMonumentService_createMonumentDate_ValidYear_NullMonth() {
        Date result = MonumentService.createMonumentDate("2013", null);

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(result);

        assertEquals(2013, calendar.get(Calendar.YEAR));
        assertEquals(0, calendar.get(Calendar.MONTH));
        assertEquals(1, calendar.get(Calendar.DAY_OF_MONTH));
    }

    @Test
    public void testMonumentService_createMonumentDate_ValidYear_ValidMonth() {
        Date result = MonumentService.createMonumentDate("2013", "5");

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(result);

        assertEquals(2013, calendar.get(Calendar.YEAR));
        assertEquals(5, calendar.get(Calendar.MONTH));
        assertEquals(1, calendar.get(Calendar.DAY_OF_MONTH));
    }

    @Test
    public void testMonumentService_createMonumentDate_ValidYear_ValidMonth_NullDay() {
        Date result = MonumentService.createMonumentDate("2013", "5", null);

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(result);

        assertEquals(2013, calendar.get(Calendar.YEAR));
        assertEquals(5, calendar.get(Calendar.MONTH));
        assertEquals(1, calendar.get(Calendar.DAY_OF_MONTH));
    }

    @Test
    public void testMonumentService_createMonumentDate_ValidYear_ValidMonth_ValidDay() {
        Date result = MonumentService.createMonumentDate("2013", "5", "22");

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(result);

        assertEquals(2013, calendar.get(Calendar.YEAR));
        assertEquals(5, calendar.get(Calendar.MONTH));
        assertEquals(22, calendar.get(Calendar.DAY_OF_MONTH));
    }

    /* createMonumentDateFromJsonDate Tests */

    @Test
    public void testMonumentService_createMonumentDateFromJsonDate_NullJsonDate() {
        assertNull(MonumentService.createMonumentDateFromJsonDate(null));
    }

    @Test
    public void testMonumentService_createMonumentDateFromJson_InvalidJsonDate() {
        assertNull(MonumentService.createMonumentDateFromJsonDate("Blah"));
    }

    @Test
    public void testMonumentService_createMonumentDateFromJsonDate_ValidJsonDate() {
        Date result = MonumentService.createMonumentDateFromJsonDate("2012-04-23T18:25:43.511Z");

        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(result);

        assertEquals(2012, calendar.get(Calendar.YEAR));
        assertEquals(3, calendar.get(Calendar.MONTH));
        assertEquals(23, calendar.get(Calendar.DAY_OF_MONTH));
    }

    /* createMonumentReferences Tests */

    @Test
    public void testMonumentService_createMonumentReferences_NullReferenceUrls_NonNullMonument() {
        Monument monument = new Monument();
        assertNull(this.monumentService.createMonumentReferences(null, monument));
    }

    @Test
    public void testMonumentService_createMonumentReferences_NonNullReferenceUrls_NullMonument() {
        List<String> referenceUrls = new ArrayList<>();
        assertNull(this.monumentService.createMonumentReferences(referenceUrls, null));
    }

    @Test
    public void testMonumentService_createMonumentReferences_NullReferenceUrls_NullMonument() {
        assertNull(this.monumentService.createMonumentReferences(null, null));
    }

    @Test
    public void testMonumentService_createMonumentReferences_EmptyReferenceUrls() {
        List<String> referenceUrls = new ArrayList<>();
        Monument monument = new Monument();

        List<Reference> result = this.monumentService.createMonumentReferences(referenceUrls, monument);

        assertEquals(0, result.size());
    }

    @Test
    public void testMonumentService_createMonumentReferences_OneNullReferenceUrl() {
        List<String> referenceUrls = new ArrayList<>();
        referenceUrls.add(null);

        Monument monument = new Monument();

        List<Reference> result = this.monumentService.createMonumentReferences(referenceUrls, monument);

        assertEquals(0, result.size());
    }

    @Test
    public void testMonumentService_createMonumentReferences_OneEmptyReferenceUrl() {
        List<String> referenceUrls = new ArrayList<>();
        referenceUrls.add("");

        Monument monument = new Monument();

        List<Reference> result = this.monumentService.createMonumentReferences(referenceUrls, monument);

        assertEquals(0, result.size());
    }

    @Test
    public void testMonumentService_createMonumentReferences_OneNullAndOneEmptyReferenceUrl() {
        List<String> referenceUrls = new ArrayList<>();
        referenceUrls.add(null);
        referenceUrls.add("");

        Monument monument = new Monument();

        List<Reference> result = this.monumentService.createMonumentReferences(referenceUrls, monument);

        assertEquals(0, result.size());
    }

    @Test
    public void testMonumentService_createMonumentReferences_OneReferenceUrl() {
        List<String> referenceUrls = new ArrayList<>();
        referenceUrls.add("test");

        Monument monument = new Monument();
        monument.setTitle("Monument");

        List<Reference> result = this.monumentService.createMonumentReferences(referenceUrls, monument);

        assertEquals(1, result.size());

        Reference reference = result.get(0);
        assertEquals("test", reference.getUrl());
        assertEquals("Monument", reference.getMonument().getTitle());
    }

    @Test
    public void testMonumentService_createMonumentReferences_ThreeReferenceUrlsWithOneNullAndOneEmpty() {
        List<String> referenceUrls = new ArrayList<>();
        referenceUrls.add("test1");
        referenceUrls.add("test2");
        referenceUrls.add("test3");
        referenceUrls.add(null);
        referenceUrls.add("");

        Monument monument = new Monument();
        monument.setTitle("Monument");

        List<Reference> result = this.monumentService.createMonumentReferences(referenceUrls, monument);

        assertEquals(3, result.size());

        Reference reference1 = result.get(0);
        assertEquals("test1", reference1.getUrl());
        assertEquals("Monument", reference1.getMonument().getTitle());

        Reference reference2 = result.get(1);
        assertEquals("test2", reference2.getUrl());
        assertEquals("Monument", reference2.getMonument().getTitle());

        Reference reference3 = result.get(2);
        assertEquals("test3", reference3.getUrl());
        assertEquals("Monument", reference3.getMonument().getTitle());
    }
}
