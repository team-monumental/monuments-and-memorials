package com.monumental.repositories.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.TagRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Test class for integration testing the MonumentRepository CRUD operations and their connection to the database
 * The tests in this class utilize an H2 in-memory database as to not ruin the actual database
 */

@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class MonumentRepositoryIntegrationTests {

    @Autowired
    private MonumentRepository monumentRepository;

    @Autowired
    private TagRepository tagRepository;

    /* getAllByTagId Tests */

    @Test
    public void testMonumentRepository_getAllByTagId_OneMonument_OneTag() {
        Monument monument = this.makeTestMonument("Monument 1");
        Tag tag = this.makeTestTag("Tag 1");

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        List<Tag> tags = new ArrayList<>();
        tags.add(tag);

        monument.setTags(tags);
        tag.setMonuments(monuments);

        this.monumentRepository.save(monument);
        Integer tagId = this.tagRepository.save(tag).getId();

        List<Monument> results = this.monumentRepository.getAllByTagId(tagId);

        assertEquals(1, results.size());

        Monument result = results.get(0);

        assertEquals(monument.getTitle(), result.getTitle());
    }

    @Test
    public void testMonumentRepository_getAllByTagId_OneMonument_NoTags() {
        Monument monument = this.makeTestMonument("Monument 1");

        this.monumentRepository.save(monument);

        List<Monument> results = this.monumentRepository.getAllByTagId(1);

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentRepository_getAllByTagId_NoMonument_OneTag() {
        Tag tag = this.makeTestTag("Tag 1");

        Integer tagId = this.tagRepository.save(tag).getId();

        List<Monument> results = this.monumentRepository.getAllByTagId(tagId);

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentRepository_getAllByTagId_OneMonument_ThreeTags() {
        Monument monument = this.makeTestMonument("Monument 1");
        List<Tag> tags = this.makeTestTags();

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        monument.setTags(tags);

        for (Tag tag : tags) {
            tag.setMonuments(monuments);
        }

        this.monumentRepository.save(monument);
        List<Tag> savedTags = this.tagRepository.saveAll(tags);

        List<Integer> savedTagIds = new ArrayList<>();
        for (Tag tag : savedTags) {
            savedTagIds.add(tag.getId());
        }

        for (Integer savedTagId : savedTagIds) {
            List<Monument> results = this.monumentRepository.getAllByTagId(savedTagId);

            assertEquals(1, results.size());

            Monument result = results.get(0);

            assertEquals(monument.getTitle(), result.getTitle());
        }
    }

    @Test
    public void testMonumentRepository_getAllByTagId_ThreeMonuments_OneTag() {
        List<Monument> monuments = this.makeTestMonuments();
        Tag tag = this.makeTestTag("Tag 1");

        List<Tag> tags = new ArrayList<>();
        tags.add(tag);

        for (Monument monument : monuments) {
            monument.setTags(tags);
        }

        tag.setMonuments(monuments);

        this.monumentRepository.saveAll(monuments);
        Integer tagId = this.tagRepository.save(tag).getId();

        List<Monument> results = this.monumentRepository.getAllByTagId(tagId);

        assertEquals(3, results.size());

        List<String> monumentTitles = new ArrayList<>();
        monumentTitles.add("Monument 1");
        monumentTitles.add("Monument 2");
        monumentTitles.add("Monument 3");

        for (Monument result : results) {
            assertTrue(monumentTitles.contains(result.getTitle()));
        }
    }

    @Test
    public void testMonumentRepository_getAllByTagId_VariousMonuments_VariousTags() {
        List<Monument> monuments = this.makeTestMonuments();
        Monument monument1 = monuments.get(0);
        Monument monument2 = monuments.get(1);
        Monument monument3 = monuments.get(2);

        List<Tag> tags = this.makeTestTags();
        Tag tag1 = tags.get(0);
        Tag tag2 = tags.get(1);
        Tag tag3 = tags.get(2);

        // Monument 1 gets all of the Tags
        monument1.setTags(tags);

        // Monument 2 gets none of the Tags

        // Monument 3 gets Tag 2
        List<Tag> monument3Tags = new ArrayList<>();
        monument3Tags.add(tag2);

        monument3.setTags(monument3Tags);

        // Tag 1 gets Monument 1
        List<Monument> tag1Monuments = new ArrayList<>();
        tag1Monuments.add(monument1);

        tag1.setMonuments(tag1Monuments);

        // Tag 2 gets Monument 1 and Monument 3
        List<Monument> tag2Monuments = new ArrayList<>();
        tag2Monuments.add(monument1);
        tag2Monuments.add(monument3);

        tag2.setMonuments(tag2Monuments);

        // Tag 3 gets Monument 1
        tag3.setMonuments(tag1Monuments);

        this.monumentRepository.saveAll(monuments);
        List<Tag> savedTags = this.tagRepository.saveAll(tags);

        List<Integer> savedTagIds = new ArrayList<>();

        for (Tag savedTag : savedTags) {
            savedTagIds.add(savedTag.getId());
        }

        for (Integer savedTagId : savedTagIds) {
            // If Tag is ID 4, should return Monument 1
            if (savedTagId == 4) {
                List<Monument> results = this.monumentRepository.getAllByTagId(savedTagId);

                assertEquals(1, results.size());

                Monument result = results.get(0);

                assertEquals(monument1.getTitle(), result.getTitle());
            }
            // If Tag is ID 5, should return Monument 1 and Monument 3
            else if (savedTagId == 5) {
                List<Monument> results = this.monumentRepository.getAllByTagId(savedTagId);

                assertEquals(2, results.size());

                List<String> resultTitles = new ArrayList<>();

                for (Monument result : results) {
                    resultTitles.add(result.getTitle());
                }

                assertTrue(resultTitles.contains(monument1.getTitle()));
                assertTrue(resultTitles.contains(monument3.getTitle()));
            }
            // If Tag is ID 6, should only return Monument 1
            else {
                List<Monument> results = this.monumentRepository.getAllByTagId(savedTagId);

                assertEquals(1, results.size());

                Monument result = results.get(0);

                assertEquals(monument1.getTitle(), result.getTitle());
            }
        }
    }

    /**
     * Helper function to create a test Monument object
     * @return Monument - Test Monument object
     */
    private Monument makeTestMonument(String name) {
        Monument monument = new Monument();
        monument.setTitle(name);

        return monument;
    }

    /**
     * Helper function to create a test Tag object with the specified name
     * @param name - String for the name of the Tag
     * @return Tag - Test Tag object with the specified name
     */
    private Tag makeTestTag(String name) {
        Tag tag = new Tag();
        tag.setName(name);

        return tag;
    }

    /**
     * Helper function to create a List of Monument objects
     * @return List<Monument> - List of test Monument objects
     */
    private List<Monument> makeTestMonuments() {
        List<Monument> monuments = new ArrayList<>();

        monuments.add(this.makeTestMonument("Monument 1"));
        monuments.add(this.makeTestMonument("Monument 2"));
        monuments.add(this.makeTestMonument("Monument 3"));

        return monuments;
    }

    /**
     * Helper function to create a List of Tag objects
     * @return List<Tag> - List of test Tag objects
     */
    private List<Tag> makeTestTags() {
        List<Tag> tags = new ArrayList<>();

        tags.add(this.makeTestTag("Tag 1"));
        tags.add(this.makeTestTag("Tag 2"));
        tags.add(this.makeTestTag("Tag 3"));

        return tags;
    }
}
