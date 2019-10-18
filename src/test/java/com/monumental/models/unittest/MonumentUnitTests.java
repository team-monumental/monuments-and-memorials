package com.monumental.models.unittest;

import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.models.Contribution;
import com.monumental.models.Tag;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.text.ParseException;
import java.text.SimpleDateFormat;
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

    /** addContribution Tests **/
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

        assertEquals("The Title in City, State was created by Artist in 2019. You may find further information " +
                "about this monument at: URL", result);
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

        assertEquals("The Title in City, State was created by Artist in 2019. You may find further information " +
                "about this monument at: URL1", result);
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

    @Test
    public void testMonument_addContribution_NullContributions_NullAttributes() {
        Monument monument = new Monument();

        Contribution contribution = new Contribution();

        monument.addContribution(contribution);

        assertEquals(0, monument.getContributions().size());
    }

    @Test
    public void testMonument_addContribution_NullContributions_NullDate() {
        Monument monument = new Monument();

        Contribution contribution = new Contribution();
        contribution.setSubmittedBy("Submitted By");

        monument.addContribution(contribution);

        assertEquals(0, monument.getContributions().size());
    }

    @Test
    public void testMonument_addContribution_NullContributions_NullSubmittedBy() {
        Monument monument = new Monument();

        Contribution contribution = new Contribution();
        contribution.setDate(new Date());

        monument.addContribution(contribution);

        assertEquals(0, monument.getContributions().size());
    }

    @Test
    public void testMonument_addContribution_NullContributions_EmptySubmittedBy() {
        Monument monument = new Monument();

        Contribution contribution = new Contribution();
        contribution.setDate(new Date());
        contribution.setSubmittedBy("");

        monument.addContribution(contribution);

        assertEquals(0, monument.getContributions().size());
    }

    @Test
    public void testMonument_addContribution_NullContributions_UniqueContribution() {
        Monument monument = new Monument();

        Contribution contribution = new Contribution();
        contribution.setDate(new Date());
        contribution.setSubmittedBy("Submitted By");

        monument.addContribution(contribution);

        assertEquals(1, monument.getContributions().size());
    }

    @Test
    public void testMonument_addContribution_NotNullContributions_MultipleContributionsAdded() {
        Monument monument = new Monument();
        monument.setContributions(new ArrayList<>());

        Date date1 = new Date();
        Date date2 = new Date();

        try {
            String dateString1 = "16/10/2019";
            date1 = new SimpleDateFormat("dd/MM/yyyy").parse(dateString1);

            String dateString2 = "17/10/2019";
            date2 = new SimpleDateFormat("dd/MM/yyyy").parse(dateString2);
        }
        catch (ParseException e) {
            fail("Could not parse date Strings");
        }

        Contribution contribution1 = new Contribution();
        contribution1.setDate(date1);
        contribution1.setSubmittedBy("Submitted By1");

        Contribution contribution2 = new Contribution();
        contribution2.setDate(date1);
        contribution2.setSubmittedBy("Submitted By1");

        Contribution contribution3 = new Contribution();
        contribution3.setDate(date1);
        contribution3.setSubmittedBy("Submitted By2");

        Contribution contribution4 = new Contribution();
        contribution4.setDate(date2);
        contribution4.setSubmittedBy("Submitted By1");

        monument.addContribution(contribution1);
        monument.addContribution(contribution2);
        monument.addContribution(contribution3);
        monument.addContribution(contribution4);

        assertEquals(3, monument.getContributions().size());
    }

    /** addReference Tests **/
    @Test
    public void testMonument_addReference_NullReferences_NullUrl() {
        Monument monument = new Monument();

        Reference reference = new Reference();

        monument.addReference(reference);

        assertEquals(0, monument.getReferences().size());
    }

    @Test
    public void testMonument_addReference_NullReferences_EmptyUrl() {
        Monument monument = new Monument();

        Reference reference = new Reference();
        reference.setUrl("");

        monument.addReference(reference);

        assertEquals(0, monument.getReferences().size());
    }

    @Test
    public void testMonument_addReference_NullReferences_UniqueReference() {
        Monument monument = new Monument();

        Reference reference = new Reference();
        reference.setUrl("URL");

        monument.addReference(reference);

        assertEquals(1, monument.getReferences().size());
    }

    @Test
    public void testMonument_addReference_NotNullReferences_MultipleReferencesAdded() {
        Monument monument = new Monument();
        monument.setReferences(new ArrayList<>());

        Reference reference1 = new Reference();
        reference1.setUrl("URL1");

        Reference reference2 = new Reference();
        reference2.setUrl("URL1");

        Reference reference3 = new Reference();
        reference3.setUrl("URL3");

        monument.addReference(reference1);
        monument.addReference(reference2);
        monument.addReference(reference3);

        assertEquals(2, monument.getReferences().size());
    }

    /** validate Tests **/

    @Test
    public void testMonument_validate_NullTitle_NullMaterial() {
        Monument monument = new Monument();

        List<String> violationMessages = monument.validate();

        assertEquals(2, violationMessages.size());
        assertTrue(violationMessages.contains("Title can not be null"));
        assertTrue(violationMessages.contains("Material can not be null"));
    }

    @Test
    public void testMonument_validate_NullTitle_NotNullMaterial() {
        Monument monument = new Monument();
        monument.setMaterial("Material");

        List<String> violationMessages = monument.validate();

        assertEquals(1, violationMessages.size());
        assertTrue(violationMessages.contains("Title can not be null"));
    }

    @Test
    public void testMonument_validate_NotNullTitle_NullMaterial() {
        Monument monument = new Monument();
        monument.setTitle("Title");

        List<String> violationMessages = monument.validate();

        assertEquals(1, violationMessages.size());
        assertTrue(violationMessages.contains("Material can not be null"));
    }

    @Test
    public void testMonument_validate_NotNullTitle_NotNullMaterial() {
        Monument monument = new Monument();
        monument.setTitle("Title");
        monument.setMaterial("Material");

        List<String> violationMessages = monument.validate();

        assertNull(violationMessages);
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
