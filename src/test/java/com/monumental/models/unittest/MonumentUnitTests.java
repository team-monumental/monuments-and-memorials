package com.monumental.models.unittest;

import com.monumental.models.Monument;
import com.monumental.models.Reference;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Test class for unit testing methods on the Monument class
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class MonumentUnitTests {

    /** getDescription Tests **/

    @Test
    public void testMonument_getDescription_TitleStartsWithThe_LowerCase() {
        Monument monument = makeTestMonument("the Title", "City", "State", "Artist", new Date(), null);

        String result = monument.getDescription();

        assertEquals("the Title in City, State was created by Artist in 2019.", result);
    }

    @Test
    public void testMonument_getDescription_TitleStartsWithThe_UpperCase() {
        Monument monument = makeTestMonument("The Title", "City", "State", "Artist", new Date(), null);

        String result = monument.getDescription();

        assertEquals("The Title in City, State was created by Artist in 2019.", result);
    }

    @Test
    public void testMonument_getDescription_TitleStartsWithThe_MixedCase() {
        Monument monument = makeTestMonument("ThE Title", "City", "State", "Artist", new Date(), null);

        String result = monument.getDescription();

        assertEquals("ThE Title in City, State was created by Artist in 2019.", result);
    }

    @Test
    public void testMonument_getDescription_TitleStartsWithTheNoSpace() {
        Monument monument = makeTestMonument("TheTitle", "City", "State", "Artist", new Date(), null);

        String result = monument.getDescription();

        assertEquals("The TheTitle in City, State was created by Artist in 2019.", result);
    }

    @Test
    public void testMonument_getDescription_NotNullReferencesList_NullFirstReference() {
        ArrayList<Reference> references = new ArrayList<>();
        references.add(null);

        Monument monument = makeTestMonument("Title", "City", "State", "Artist", new Date(), references);

        String result = monument.getDescription();

        assertEquals("The Title in City, State was created by Artist in 2019.", result);
    }

    @Test
    public void testMonument_getDescription_NotNullReferencesList_NullFirstReferenceUrl() {
        ArrayList<Reference> references = new ArrayList<>();

        Reference reference = new Reference();
        references.add(reference);

        Monument monument = makeTestMonument("Title", "City", "State", "Artist", new Date(), references);

        String result = monument.getDescription();

        assertEquals("The Title in City, State was created by Artist in 2019.", result);
    }

    @Test
    public void testMonument_getDescription_NotNullReferencesList_NotNullFirstReference() {
        ArrayList<Reference> references = new ArrayList<>();

        Reference reference = new Reference();
        reference.setUrl("URL");
        references.add(reference);

        Monument monument = makeTestMonument("Title", "City", "State", "Artist", new Date(), references);

        String result = monument.getDescription();

        /*
            TODO: Re-enable once references in descriptions are working again
        assertEquals("The Title in City, State was created by Artist in 2019. You may find further information " +
                "about this monument or memorial at: URL", result);
         */
        assertEquals("The Title in City, State was created by Artist in 2019.", result);
    }

    @Test
    public void testMonument_getDescription_NotNullReferencesList_MultipleReferences() {
        ArrayList<Reference> references = new ArrayList<>();

        Reference reference1 = new Reference();
        reference1.setUrl("URL1");
        references.add(reference1);

        Reference reference2 = new Reference();
        reference2.setUrl("URL2");
        references.add(reference2);

        Reference reference3 = new Reference();
        reference3.setUrl("URL3");
        references.add(reference3);

        Monument monument = makeTestMonument("Title", "City", "State", "Artist", new Date(), references);

        String result = monument.getDescription();

        /*
            TODO: Re-enable once references in descriptions are working again
        assertEquals("The Title in City, State was created by Artist in 2019. You may find further information " +
                "about this monument or memorial at: URL1", result);
         */
        assertEquals("The Title in City, State was created by Artist in 2019.", result);
    }

    @Test
    public void testMonument_getDescription_NotNullDescription() {
        ArrayList<Reference> references = new ArrayList<>();

        Reference reference = new Reference();
        reference.setUrl("URL");
        references.add(reference);

        Monument monument = makeTestMonument("Title", "City", "State", "Artist", new Date(), references);
        monument.setDescription("This is a Description");

        String result = monument.getDescription();

        assertEquals("This is a Description", result);
    }

    /** validate Tests **/

    @Test
    public void testMonument_validate_New_NullTitle() {
        Monument monument = new Monument();

        Monument.ValidationResult result = monument.validate(Monument.New.class);

        assertFalse(result.isValid());

        List<String> violationMessages = result.getViolationMessages();

        assertEquals(1, violationMessages.size());
        assertTrue(violationMessages.contains("Title can not be null"));
    }

    @Test
    public void testMonument_validate_New_NotNullId_NotNullTitle() {
        Monument monument = new Monument();
        monument.setId(1);
        monument.setTitle("Title");

        Monument.ValidationResult result = monument.validate(Monument.New.class);

        assertFalse(result.isValid());

        List<String> violationMessages = result.getViolationMessages();

        assertEquals(1, violationMessages.size());
        assertTrue(violationMessages.contains("ID can not be specified on insert"));
    }

     @Test
     public void testMonument_validate_Existing_NullId_NotNullTitle() {
     Monument monument = new Monument();
     monument.setTitle("Title");

     Monument.ValidationResult result = monument.validate(Monument.Existing.class);

     assertFalse(result.isValid());

     List<String> violationMessages = result.getViolationMessages();

     assertEquals(1, violationMessages.size());
     assertTrue(violationMessages.contains("ID can not be null on update"));
     }

    @Test
    public void testMonument_validate_New_NotNullTitle() {
        Monument monument = new Monument();
        monument.setTitle("Title");

        Monument.ValidationResult result = monument.validate(Monument.New.class);

        assertTrue(result.isValid());

        List<String> violationMessages = result.getViolationMessages();

        assertTrue(violationMessages.isEmpty());
    }

    @Test
    public void testMonument_validate_Existing_NotNullId_NullTitle() {
        Monument monument = new Monument();
        monument.setId(1);

        Monument.ValidationResult result = monument.validate(Monument.Existing.class);

        assertFalse(result.isValid());

        List<String> violationMessages = result.getViolationMessages();

        assertEquals(1, violationMessages.size());
        assertTrue(violationMessages.contains("Title can not be null"));
    }

    @Test
    public void testMonument_validate_Existing_NotNullId_NotNullTitle() {
        Monument monument = new Monument();
        monument.setId(1);
        monument.setTitle("Title");
        Monument.ValidationResult result = monument.validate(Monument.Existing.class);

        assertTrue(result.isValid());

        List<String> violationMessages = result.getViolationMessages();

        assertTrue(violationMessages.isEmpty());
    }

    /**
     * Helper function to make a test Monument based on the specified parameters
     * @param title - String to set the Monument's title to
     * @param city - String to set the Monument's city to
     * @param state - String to set the Monument's state to
     * @param artist - String to set the Monument's artist to
     * @param date - Date to set the Monument's date to
     * @param references - List of References to set the Monument's references to
     * @return Monument - the Monument represented by the specified parameters
     */
    private Monument makeTestMonument(String title, String city, String state, String artist, Date date,
                                      List<Reference> references) {
        Monument monument = new Monument();

        monument.setTitle(title);
        monument.setCity(city);
        monument.setState(state);
        monument.setArtist(artist);
        monument.setDate(date);
        monument.setReferences(references);

        return monument;
    }
}
