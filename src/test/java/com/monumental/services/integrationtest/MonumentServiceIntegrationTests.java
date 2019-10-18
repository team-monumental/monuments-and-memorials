package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Test class for integration testing the MonumentService CRUD operations and their connection to the database
 * The tests in this class utilize an H2 in-memory database as to not ruin the actual database
 */

@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class MonumentServiceIntegrationTests {

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private TagService tagService;

    /** insert Tests **/

    /**
     * Test method for integration testing MonumentService.insert(record)
     * Checks that the returned result from the insert is not null, meaning it was inserted correctly
     */
    @Test
    public void testMonumentService_insert_Single() {
        Monument monument = makeTestMonument();

        Integer result = this.monumentService.insert(monument);

        assertNotNull(result);
    }

    /**
     * Test method for integration testing MonumentService.insert(List<record>)
     * Checks that the number of returned results is 3 and that each is not null, meaning they were all inserted
     * correctly
     */
    @Test
    public void testMonumentService_insert_Multiple() {
        List<Monument> monuments = makeTestMonuments();

        List<Integer> results = this.monumentService.insert(monuments);

        assertEquals(3, results.size());

        for (Integer result : results) {
            assertNotNull(result);
        }
    }

    /** get Tests **/

    /**
     * Test method for integration testing MonumentService.get(record)
     * First inserts a record into the database then performs a get to verify the records are the same
     */
    @Test
    public void testMonumentService_get_Single() {
        Monument monument = makeTestMonument();

        Integer id = this.monumentService.insert(monument);

        Monument result = this.monumentService.get(id);

        assertEquals(monument.getTitle(), result.getTitle());
        assertEquals(monument.getArtist(), result.getArtist());
    }

    /**
     * Test method for integration testing MonumentService.getAll(List<record>)
     * First inserts 3 records into the database then performs a get for only 2 of the records
     * Checks that only 2 records are returned and that they have the expected attributes
     */
    @Test
    public void testMonumentService_getAll_ListPassed() {
        ArrayList<Monument> monuments = makeTestMonuments();

        this.monumentService.insert(monuments);

        ArrayList<Integer> idsToGet = new ArrayList<>();
        idsToGet.add(1);
        idsToGet.add(3);

        HashMap<Integer, Monument> monumentsById = new HashMap<>();
        monumentsById.put(1, monuments.get(0));
        monumentsById.put(3, monuments.get(2));

        List<Monument> results = this.monumentService.get(idsToGet);

        assertEquals(2, results.size());

        for (Monument result : results) {
            Monument monument = monumentsById.get(result.getId());

            assertEquals(monument.getTitle(), result.getTitle());
            assertEquals(monument.getArtist(), result.getArtist());
        }
    }

    /** getAll Tests **/

    /**
     * Test method for integration testing MonumentService.getAll(null)
     * First inserts 3 records into the database then performs a getAll for all 3 records
     * Checks that 3 records are returned and that they have the expected attributes
     */
    @Test
    public void testMonumentService_getAll_NullPassed() {
        ArrayList<Monument> monuments = makeTestMonuments();

        this.monumentService.insert(monuments);

        HashMap<Integer, Monument> monumentsById = new HashMap<>();
        monumentsById.put(1, monuments.get(0));
        monumentsById.put(2, monuments.get(1));
        monumentsById.put(3, monuments.get(2));

        List<Monument> results = this.monumentService.getAll();

        assertEquals(3, results.size());

        for (Monument result : results) {
            Monument monument = monumentsById.get(result.getId());

            assertEquals(monument.getTitle(), result.getTitle());
            assertEquals(monument.getArtist(), result.getArtist());
        }
    }

    /** update Tests **/

    /**
     * Test method for integration testing MonumentService.update(record)
     * First inserts a record into the database then does a get to retrieve it
     * Then, changes some of the attributes on the record before calling update
     * Finally, it does another get for the record and checks to make sure the changes were persisted
     */
    @Test
    public void testMonumentService_update_Single() {
        Monument monument = makeTestMonument();

        Integer id = this.monumentService.insert(monument);

        Monument storedMonument = this.monumentService.get(id);

        storedMonument.setTitle("Monument 2");
        storedMonument.setArtist("Artist 2");

        this.monumentService.update(storedMonument);

        Monument result = this.monumentService.get(id);

        assertEquals(storedMonument.getTitle(), result.getTitle());
        assertEquals(storedMonument.getArtist(), result.getArtist());
    }

    /**
     * Test method for integration testing MonumentService.update(List<record>)
     * First inserts 3 records into the database then does a get to retrieve them
     * Then, changes some of the attributes on the records before doing an update
     * Finally, it does another get for the records and checks to make sure the changes were persisted
     */
    @Test
    public void testMonumentService_update_Multiple() {
        ArrayList<Monument> monuments = makeTestMonuments();

        List<Integer> ids = this.monumentService.insert(monuments);

        List<Monument> storedMonuments = this.monumentService.get(ids);

        HashMap<Integer, Monument> monumentsById = new HashMap<>();

        for (Monument storedMonument : storedMonuments) {
            if (storedMonument.getId() == 1) {
                storedMonument.setTitle("Stored Monument 1");
                storedMonument.setArtist("Stored Artist 1");
            }
            else if (storedMonument.getId() == 3) {
                storedMonument.setTitle("Stored Monument 3");
            }

            monumentsById.put(storedMonument.getId(), storedMonument);
        }

        this.monumentService.update(storedMonuments);

        List<Monument> results = this.monumentService.get(ids);

        for (Monument result : results) {
            Monument monument = monumentsById.get(result.getId());

            assertEquals(monument.getTitle(), result.getTitle());
            assertEquals(monument.getArtist(), result.getArtist());
        }
    }

    /** delete Tests **/

    /**
     * Test method for integration testing MonumentService.delete(id)
     * First, does an insert to insert a single record into the database
     * Then, does a get for that record and checks to make sure it was saved properly
     * Finally, does a delete and checks that another get returns null
     */
    @Test
    public void testMonumentService_delete_Single() {
        Monument monument = makeTestMonument();

        Integer id = this.monumentService.insert(monument);

        Monument storedMonument = this.monumentService.get(id);

        assertNotNull(storedMonument);

        this.monumentService.delete(id);

        Monument result = this.monumentService.get(id);

        assertNull(result);
    }

    /**
     * Test method for integration testing MonumentService.delete(ids)
     * First, inserts 3 records into the database and does a getAll to check that they were all saved properly
     * Then, does a delete followed by another getAll to check that the returned results are null or not null as expected
     */
    @Test
    public void testMonumentService_delete_Multiple() {
        List<Monument> monuments = makeTestMonuments();

        this.monumentService.insert(monuments);

        for (Monument storedMonument : this.monumentService.getAll()) {
            assertNotNull(storedMonument);
        }

        ArrayList<Integer> idsToDelete = new ArrayList<>();
        idsToDelete.add(1);
        idsToDelete.add(3);

        this.monumentService.delete(idsToDelete);

        assertNull(this.monumentService.get(1));
        assertNull(this.monumentService.get(3));

        assertNotNull(this.monumentService.get(2));
    }

    /** addTagToMonument Tests **/

    @Test
    public void test_MonumentService_addTagToMonument_TagDoesNotExist() {
        Monument monument = new Monument();
        monument.setTitle("Title 1");
        monument.setDate(new Date());

        Integer monumentId = this.monumentService.insert(monument);

        Tag tag = new Tag();
        tag.setName("Tag 1");

        this.monumentService.addTagToMonument(monument, tag);

        Monument resultMonument = this.monumentService.get(monumentId);

        assertEquals(1, resultMonument.getTags().size());

        Tag resultTag = resultMonument.getTags().get(0);

        assertEquals(1, resultTag.getMonuments().size());

        assertEquals(tag.getName(), resultTag.getName());

        assertEquals(monument.getTitle(), resultTag.getMonuments().get(0).getTitle());

        assertEquals(1, this.tagService.getAll().size());
    }

    @Test
    public void test_MonumentService_addTagToMonument_TagExists_NotAssociated() {
        Monument monument = new Monument();
        monument.setTitle("Title 1");
        monument.setDate(new Date());

        Integer monumentId = this.monumentService.insert(monument);

        Tag tag = new Tag();
        tag.setName("Tag 1");

        this.tagService.insert(tag);

        this.monumentService.addTagToMonument(monument, tag);

        Monument resultMonument = this.monumentService.get(monumentId);

        assertEquals(1, resultMonument.getTags().size());

        Tag resultTag = resultMonument.getTags().get(0);

        assertEquals(1, resultTag.getMonuments().size());

        assertEquals(tag.getName(), resultTag.getName());

        assertEquals(monument.getTitle(), resultTag.getMonuments().get(0).getTitle());


        assertEquals(1, this.tagService.getAll().size());
    }

    @Test
    public void test_MonumentService_addTagToMonument_TagExists_Associated() {
        Monument monument = new Monument();
        monument.setTitle("Title 1");
        monument.setDate(new Date());

        Tag tag = new Tag();
        tag.setName("Tag 1");

        monument.addTag(tag);
        tag.addMonument(monument);

        this.tagService.insert(tag);

        Integer monumentId = this.monumentService.insert(monument);

        this.monumentService.addTagToMonument(monument, tag);

        Monument resultMonument = this.monumentService.get(monumentId);

        assertEquals(1, resultMonument.getTags().size());

        Tag resultTag = resultMonument.getTags().get(0);

        assertEquals(1, resultTag.getMonuments().size());

        assertEquals(tag.getName(), resultTag.getName());

        assertEquals(monument.getTitle(), resultTag.getMonuments().get(0).getTitle());

        assertEquals(1, this.tagService.getAll().size());
    }

    /** addTagsToMonument Tests **/

    @Test
    public void test_MonumentService_addTagsToMonument_VariousTags_MultipleCalls() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1.setDate(new Date());

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2.setDate(new Date());

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3.setDate(new Date());

        Tag tag1 = new Tag();
        tag1.setName("Tag 1");

        Tag tag2 = new Tag();
        tag2.setName("Tag 2");

        Tag tag3 = new Tag();
        tag3.setName("Tag 3");

        monument3.addTag(tag3);
        tag3.addMonument(monument3);

        Integer tag1Id = this.tagService.insert(tag1);
        Integer tag3Id = this.tagService.insert(tag3);

        Integer monument1Id = this.monumentService.insert(monument1);
        Integer monument2Id = this.monumentService.insert(monument2);
        Integer monument3Id = this.monumentService.insert(monument3);

        // Validate before 1st call
        // 2 Tags should exist in the database
        // Tag 3 should be associated with Monument 3
        assertEquals(2, this.tagService.getAll().size());
        assertEquals(1, this.tagService.get(tag3Id).getMonuments().size());
        // Can safely assume Tag 3 only has 1 Monument
        assertEquals(monument3.getTitle(), this.tagService.get(tag3Id).getMonuments().get(0).getTitle());

        ArrayList<Tag> tagsToAddMonument1 = new ArrayList<>();
        tagsToAddMonument1.add(tag1);
        tagsToAddMonument1.add(tag3);

        this.monumentService.addTagsToMonument(monument1, tagsToAddMonument1);

        // Validate after 1st call
        // 2 Tags should exist in the database
        // Tag 1 should be associated with Monument 1
        // Tag 3 should be associated with Monument 1 and Monument 3
        assertEquals(2, this.tagService.getAll().size());
        assertEquals(1, this.tagService.get(tag1Id).getMonuments().size());
        // Can safely assume Tag 1 only has 1 Monument
        assertEquals(monument1.getTitle(), this.tagService.get(tag1Id).getMonuments().get(0).getTitle());
        assertEquals(2, this.tagService.get(tag3Id).getMonuments().size());

        boolean foundMonument1 = checkTagAssociatedWithMonument(tag3Id, "Monument 1");
        boolean foundMonument3 = checkTagAssociatedWithMonument(tag3Id, "Monument 3");

        if (!foundMonument1 || !foundMonument3) {
            fail("Tag 3 is not associated with Monument 1 and Monument 3");
        }

        ArrayList<Tag> tagsToAddMonument2 = new ArrayList<>();
        tagsToAddMonument2.add(tag2);

        this.monumentService.addTagsToMonument(monument2, tagsToAddMonument2);

        // Validate after 2nd call
        // 3 Tags should exist in the database
        // Tag 1 should be associated with Monument 1
        // Tag 2 should be associated with Monument 2
        // Tag 3 should be associated with Monument 1 and Monument 3
        assertEquals(3, this.tagService.getAll().size());
        assertEquals(1, this.tagService.get(tag1Id).getMonuments().size());
        // Can safely assume Tag 1 only has 1 Monument
        assertEquals(monument1.getTitle(), this.tagService.get(tag1Id).getMonuments().get(0).getTitle());
        assertEquals(1, this.monumentService.get(monument2Id).getTags().size());
        // Can safely assume Monument 2 only has 1 Tag
        assertEquals(tag2.getName(), this.monumentService.get(monument2Id).getTags().get(0).getName());

        foundMonument1 = checkTagAssociatedWithMonument(tag3Id, "Monument 1");
        foundMonument3 = checkTagAssociatedWithMonument(tag3Id, "Monument 3");

        if (!foundMonument1 || !foundMonument3) {
            fail("Tag 3 is not associated with Monument 1 and Monument 3");
        }

        this.monumentService.addTagsToMonument(monument3, tagsToAddMonument1);

        // Validate after 3rd call
        // 3 Tags should exist in the database
        // Tag 1 should be associated with Monument 1 and Monument 3
        // Tag 2 should be associated with Monument 2
        // Tag 3 should be associated with Monument 1 and Monument 3
        assertEquals(3, this.tagService.getAll().size());
        assertEquals(2, this.tagService.get(tag1Id).getMonuments().size());

        foundMonument1 = checkTagAssociatedWithMonument(tag1Id, "Monument 1");
        foundMonument3 = checkTagAssociatedWithMonument(tag1Id, "Monument 3");

        if (!foundMonument1 || !foundMonument3) {
            fail("Tag 1 is not associated with Monument 1 and Monument 3");
        }

        assertEquals(1, this.monumentService.get(monument2Id).getTags().size());
        // Can safely assume Monument 2 only has 1 Tag
        assertEquals(tag2.getName(), this.monumentService.get(monument2Id).getTags().get(0).getName());

        foundMonument1 = checkTagAssociatedWithMonument(tag3Id, "Monument 1");
        foundMonument3 = checkTagAssociatedWithMonument(tag3Id, "Monument 3");

        if (!foundMonument1 || !foundMonument3) {
            fail("Tag 3 is not associated with Monument 1 and Monument 3");
        }
    }

    /** getFromWhere Tests **/

    @Test
    public void test_MonumentService_getFromWhere_SingleRecordReturned() {
        Monument monument = makeTestMonument();

        this.monumentService.insert(monument);

        List<Monument> results = this.monumentService.getFromWhere("title", monument.getTitle());

        assertEquals(1, results.size());
        assertEquals(monument.getTitle(), results.get(0).getTitle());
        assertEquals(monument.getArtist(), results.get(0).getArtist());
    }

    @Test
    public void test_MonumentService_getFromWhere_MultipleRecordsReturned() {
        Monument monument1 = makeTestMonument();
        monument1.setTitle("Title 1");

        Monument monument2 = makeTestMonument();
        monument2.setTitle("Title 2");

        ArrayList<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);
        monuments.add(monument2);

        this.monumentService.insert(monuments);

        List<Monument> results = this.monumentService.getFromWhere("artist", monument1.getArtist());

        assertEquals(2, results.size());

        ArrayList<String> expectedTitles = new ArrayList<>();
        expectedTitles.add(monument1.getTitle());
        expectedTitles.add(monument2.getTitle());

        for (Monument result : results) {
            assertTrue(expectedTitles.contains(result.getTitle()));
            assertEquals("Artist", result.getArtist());
        }

        results = this.monumentService.getFromWhere("artist", monument2.getArtist());

        assertEquals(2, results.size());

        expectedTitles = new ArrayList<>();
        expectedTitles.add(monument1.getTitle());
        expectedTitles.add(monument2.getTitle());

        for (Monument result : results) {
            assertTrue(expectedTitles.contains(result.getTitle()));
            assertEquals("Artist", result.getArtist());
        }
    }

    /**
     * Helper function to make a test Monument
     * @return Monument - the test Monument
     */
    private Monument makeTestMonument() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument.setArtist("Artist");

        return monument;
    }

    /**
     * Helper function to make 3 test Monuments and return them in an ArrayList
     * @return ArrayList<Monument> - the ArrayList of test Monuments
     */
    private ArrayList<Monument> makeTestMonuments() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1.setArtist("Artist 1");

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2.setArtist("Artist 2");

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3.setArtist("Artist 3");

        ArrayList<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);
        monuments.add(monument2);
        monuments.add(monument3);

        return monuments;
    }

    /**
     * Helper method to check if the Tag associated with the specified tagId is associated with a Monument that has
     * the specified title
     * @param tagId - Integer for tagId associated with the Tag to check
     * @param title - String for the title of the Monument to check association with
     * @return boolean - true if the specified Tag is associated with a Monument that has the specified title, false otherwise
     */
    private boolean checkTagAssociatedWithMonument(Integer tagId, String title) {
        boolean foundMonument = false;

        for (Monument monument : this.tagService.get(tagId).getMonuments()) {
            if (monument.getTitle().equals(title)) {
                foundMonument = true;
                break;
            }
        }

        return foundMonument;
    }
}
