package com.monumental.models.unittest;

import com.monumental.models.suggestions.UpdateMonumentSuggestion;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

/**
 * Test class for unit testing MonumentSuggestion
 * Uses UpdateMonumentSuggestion as the concrete class for testing
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class MonumentSuggestionUnitTests {

    /**
     * deserializeStringList Tests
     **/

    @Test
    public void testMonumentSuggestion_deserializeStringList_NullJson() {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        assertNull(suggestion.getNewReferenceUrls());
    }

    @Test
    public void testMonumentSuggestion_deserializeStringList_EmptyArray() {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        suggestion.setNewReferenceUrlsJson("[]");

        assertEquals(0, suggestion.getNewReferenceUrls().size());
    }

    @Test
    public void testMonumentSuggestion_deserializeStringList_ArrayWithThreeValues() {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        suggestion.setNewReferenceUrlsJson("['String 1', 'String 2', 'String 3']");

        assertEquals(3, suggestion.getNewReferenceUrls().size());
        assertTrue(suggestion.getNewReferenceUrls().contains("String 1"));
        assertTrue(suggestion.getNewReferenceUrls().contains("String 2"));
        assertTrue(suggestion.getNewReferenceUrls().contains("String 3"));
    }

    /**
     * deserializeIntegerList Tests
     **/

    @Test
    public void testMonumentSuggestion_deserializeIntegerList_NullJson() {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        assertNull(suggestion.getDeletedReferenceIds());
    }

    @Test
    public void testMonumentSuggestion_deserializeIntegerList_EmptyArray() {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        suggestion.setDeletedReferenceIdsJson("[]");

        assertEquals(0, suggestion.getDeletedReferenceIds().size());
    }

    @Test
    public void testMonumentSuggestion_deserializeIntegerList_ArrayWithThreeValues() {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        suggestion.setDeletedReferenceIdsJson("[1, 2, 3]");

        assertEquals(3, suggestion.getDeletedReferenceIds().size());
        assertTrue(suggestion.getDeletedReferenceIds().contains(1));
        assertTrue(suggestion.getDeletedReferenceIds().contains(2));
        assertTrue(suggestion.getDeletedReferenceIds().contains(3));
    }

    /**
     * deserializeMap Tests
     **/

    @Test
    public void testMonumentSuggestion_deserializeMap_NullJson() {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        assertNull(suggestion.getUpdatedReferenceUrlsById());
    }

    @Test
    public void testMonumentSuggestion_deserializeMap_EmptyObject() {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        suggestion.setUpdatedReferenceUrlsByIdJson("{}");

        assertEquals(0, suggestion.getUpdatedReferenceUrlsById().size());
    }

    @Test
    public void testMonumentSuggestion_deserializeMap_OneAttribute() {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        suggestion.setUpdatedReferenceUrlsByIdJson("{1: 'value'}");

        assertEquals(1, suggestion.getUpdatedReferenceUrlsById().size());
        assertTrue(suggestion.getUpdatedReferenceUrlsById().containsKey(1));
        assertEquals("value", suggestion.getUpdatedReferenceUrlsById().get(1));
    }

    @Test
    public void testMonumentSuggestion_deserializeMap_ThreeAttributes() {
        UpdateMonumentSuggestion suggestion = new UpdateMonumentSuggestion();
        suggestion.setUpdatedReferenceUrlsByIdJson("{1: 'value 1', 2: 'value 2', 3: 'value 3'}");

        assertEquals(3, suggestion.getUpdatedReferenceUrlsById().size());

        assertTrue(suggestion.getUpdatedReferenceUrlsById().containsKey(1));
        assertEquals("value 1", suggestion.getUpdatedReferenceUrlsById().get(1));

        assertTrue(suggestion.getUpdatedReferenceUrlsById().containsKey(2));
        assertEquals("value 2", suggestion.getUpdatedReferenceUrlsById().get(2));

        assertTrue(suggestion.getUpdatedReferenceUrlsById().containsKey(3));
        assertEquals("value 3", suggestion.getUpdatedReferenceUrlsById().get(3));
    }
}
