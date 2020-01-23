package com.monumental.services.unittest;

import com.monumental.models.Image;
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

    /* createMonumentImages Tests */

    @Test
    public void testMonumentService_createMonumentImages_NullImagesUrls_NonNullMonument() {
        Monument monument = new Monument();
        assertNull(this.monumentService.createMonumentImages(null, monument));
    }

    @Test
    public void testMonumentService_createMonumentImages_NonNullImagesUrls_NullMonument() {
        List<String> imageUrls = new ArrayList<>();
        assertNull(this.monumentService.createMonumentImages(imageUrls, null));
    }

    @Test
    public void testMonumentService_createMonumentImages_NullImageUrls_NullMonument() {
        assertNull(this.monumentService.createMonumentImages(null, null));
    }

    @Test
    public void testMonumentService_createMonumentImages_EmptyImageUrls() {
        List<String> imageUrls = new ArrayList<>();
        Monument monument = new Monument();

        List<Image> result = this.monumentService.createMonumentImages(imageUrls, monument);

        assertEquals(0, result.size());
    }

    @Test
    public void testMonumentService_createMonumentImages_OneNullImageUrl() {
        List<String> imageUrls = new ArrayList<>();
        imageUrls.add(null);

        Monument monument = new Monument();

        List<Image> result = this.monumentService.createMonumentImages(imageUrls, monument);

        assertEquals(0, result.size());
    }

    @Test
    public void testMonumentService_createMonumentImages_OneEmptyImageUrl() {
        List<String> imageUrls = new ArrayList<>();
        imageUrls.add("");

        Monument monument = new Monument();

        List<Image> result = this.monumentService.createMonumentImages(imageUrls, monument);

        assertEquals(0, result.size());
    }

    @Test
    public void testMonumentService_createMonumentImages_OneNullAndOneEmptyImageUrl() {
        List<String> imageUrls = new ArrayList<>();
        imageUrls.add(null);
        imageUrls.add("");

        Monument monument = new Monument();

        List<Image> result = this.monumentService.createMonumentImages(imageUrls, monument);

        assertEquals(0, result.size());
    }

    @Test
    public void testMonumentService_createMonumentImages_OneImageUrl() {
        List<String> imageUrls = new ArrayList<>();
        imageUrls.add("test");

        Monument monument = new Monument();
        monument.setTitle("Monument");

        List<Image> result = this.monumentService.createMonumentImages(imageUrls, monument);

        assertEquals(1, result.size());

        Image image = result.get(0);
        assertEquals("test", image.getUrl());
        assertTrue(image.getIsPrimary());
        assertEquals("Monument", image.getMonument().getTitle());
    }

    @Test
    public void testMonumentService_createMonumentImages_OneImageUrl_MonumentAlreadyHasImages_NoPrimary() {
        List<String> imageUrls = new ArrayList<>();
        imageUrls.add("test1");

        Monument monument = new Monument();
        monument.setTitle("Monument");

        List<Image> monumentImages = new ArrayList<>();
        monumentImages.add(new Image("test2", false));

        monument.setImages(monumentImages);

        List<Image> result = this.monumentService.createMonumentImages(imageUrls, monument);

        assertEquals(1, result.size());

        Image image = result.get(0);
        assertEquals("test1", image.getUrl());
        assertTrue(image.getIsPrimary());
        assertEquals("Monument", image.getMonument().getTitle());
    }

    @Test
    public void testMonumentService_createMonumentImages_OneImageUrl_MonumentAlreadyHasPrimaryImage() {
        List<String> imageUrls = new ArrayList<>();
        imageUrls.add("test1");

        Monument monument = new Monument();
        monument.setTitle("Monument");

        List<Image> monumentImages = new ArrayList<>();
        monumentImages.add(new Image("test2", true));

        monument.setImages(monumentImages);

        List<Image> result = this.monumentService.createMonumentImages(imageUrls, monument);

        assertEquals(1, result.size());

        Image image = result.get(0);
        assertEquals("test1", image.getUrl());
        assertFalse(image.getIsPrimary());
        assertEquals("Monument", image.getMonument().getTitle());
    }

    @Test
    public void testMonumentService_createMonumentImages_ThreeImageUrlsWithOneNullAndOneEmpty() {
        List<String> imageUrls = new ArrayList<>();
        imageUrls.add("test1");
        imageUrls.add("test2");
        imageUrls.add("test3");
        imageUrls.add(null);
        imageUrls.add("");

        Monument monument = new Monument();
        monument.setTitle("Monument");

        List<Image> result = this.monumentService.createMonumentImages(imageUrls, monument);

        assertEquals(3, result.size());

        Image image1 = result.get(0);
        assertEquals("test1", image1.getUrl());
        assertTrue(image1.getIsPrimary());
        assertEquals("Monument", image1.getMonument().getTitle());

        Image image2 = result.get(1);
        assertEquals("test2", image2.getUrl());
        assertFalse(image2.getIsPrimary());
        assertEquals("Monument", image2.getMonument().getTitle());

        Image image3 = result.get(2);
        assertEquals("test3", image3.getUrl());
        assertFalse(image3.getIsPrimary());
        assertEquals("Monument", image3.getMonument().getTitle());
    }

    @Test
    public void testMonumentService_createMonumentImages_ThreeImageUrlsWithOneNullAndOneEmpty_MonumentAlreadyHasImages_NoPrimary() {
        List<String> imageUrls = new ArrayList<>();
        imageUrls.add("test1");
        imageUrls.add("test2");
        imageUrls.add("test3");
        imageUrls.add(null);
        imageUrls.add("");

        Monument monument = new Monument();
        monument.setTitle("Monument");

        List<Image> monumentImages = new ArrayList<>();
        monumentImages.add(new Image("test4", false));

        monument.setImages(monumentImages);

        List<Image> result = this.monumentService.createMonumentImages(imageUrls, monument);

        assertEquals(3, result.size());

        Image image1 = result.get(0);
        assertEquals("test1", image1.getUrl());
        assertTrue(image1.getIsPrimary());
        assertEquals("Monument", image1.getMonument().getTitle());

        Image image2 = result.get(1);
        assertEquals("test2", image2.getUrl());
        assertFalse(image2.getIsPrimary());
        assertEquals("Monument", image2.getMonument().getTitle());

        Image image3 = result.get(2);
        assertEquals("test3", image3.getUrl());
        assertFalse(image3.getIsPrimary());
        assertEquals("Monument", image3.getMonument().getTitle());
    }

    @Test
    public void testMonumentService_createMonumentImages_ThreeImageUrlsWithOneNullAndOneEmpty_MonumentAlreadyHasPrimaryImage() {
        List<String> imageUrls = new ArrayList<>();
        imageUrls.add("test1");
        imageUrls.add("test2");
        imageUrls.add("test3");
        imageUrls.add(null);
        imageUrls.add("");

        Monument monument = new Monument();
        monument.setTitle("Monument");

        List<Image> monumentImages = new ArrayList<>();
        monumentImages.add(new Image("test4", true));

        monument.setImages(monumentImages);

        List<Image> result = this.monumentService.createMonumentImages(imageUrls, monument);

        assertEquals(3, result.size());

        Image image1 = result.get(0);
        assertEquals("test1", image1.getUrl());
        assertFalse(image1.getIsPrimary());
        assertEquals("Monument", image1.getMonument().getTitle());

        Image image2 = result.get(1);
        assertEquals("test2", image2.getUrl());
        assertFalse(image2.getIsPrimary());
        assertEquals("Monument", image2.getMonument().getTitle());

        Image image3 = result.get(2);
        assertEquals("test3", image3.getUrl());
        assertFalse(image3.getIsPrimary());
        assertEquals("Monument", image3.getMonument().getTitle());
    }

    /* setBasicFieldsOnMonument Tests */

    @Test
    public void testMonumentService_setBasicFieldsOnMonument_NullMonument() {
        Monument monument = null;

        this.monumentService.setBasicFieldsOnMonument(monument, "", "", "", "", "");

        assertNull(monument);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testMonumentService_setBasicFieldsOnMonument_NullTitle() {
        Monument monument = new Monument();

        this.monumentService.setBasicFieldsOnMonument(monument, null, "", "", "", "");
    }

    @Test(expected = IllegalArgumentException.class)
    public void testMonumentService_setBasicFieldsOnMonument_EmptyTitle() {
        Monument monument = new Monument();

        this.monumentService.setBasicFieldsOnMonument(monument, "", "", "", "", "");
    }

    @Test
    public void testMonumentService_setBasicFieldsOnMonument_ValidTitle_NullOtherFields() {
        Monument monument = new Monument();

        this.monumentService.setBasicFieldsOnMonument(monument, "Title", null, null, null, null);

        assertEquals("Title", monument.getTitle());
        assertNull(monument.getAddress());
        assertNull(monument.getArtist());
        assertEquals("The Title.", monument.getDescription());
        assertNull(monument.getInscription());
    }

    @Test
    public void testMonumentService_setBasicFieldsOnMonument_ValidTitle_EmptyOtherFields() {
        Monument monument = new Monument();

        this.monumentService.setBasicFieldsOnMonument(monument, "Title", "", "", "", "");

        assertEquals("Title", monument.getTitle());
        assertEquals("", monument.getAddress());
        assertEquals("", monument.getArtist());
        assertEquals("", monument.getDescription());
        assertEquals("", monument.getInscription());
    }

    @Test
    public void testMonumentService_setBasicFieldsOnMonument_VariousFields() {
        Monument monument = new Monument();

        this.monumentService.setBasicFieldsOnMonument(monument, "Title", "Address", "Artist", "Description",
                "Inscription");

        assertEquals("Title", monument.getTitle());
        assertEquals("Address", monument.getAddress());
        assertEquals("Artist", monument.getArtist());
        assertEquals("Description", monument.getDescription());
        assertEquals("Inscription", monument.getInscription());
    }
}
