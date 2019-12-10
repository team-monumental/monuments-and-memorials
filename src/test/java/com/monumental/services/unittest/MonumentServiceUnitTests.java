package com.monumental.services.unittest;

import com.monumental.services.MonumentService;
import com.monumental.util.csvparsing.BulkCreateResult;
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
}
