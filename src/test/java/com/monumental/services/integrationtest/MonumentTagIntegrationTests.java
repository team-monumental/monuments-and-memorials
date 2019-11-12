package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Test class used to integration test the monument_tag Join Table
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class MonumentTagIntegrationTests {

    @Autowired
    MonumentService monumentService;

    @Autowired
    TagService tagService;

    /** Monument_Tag Unique Constraint Tests **/

    /**
     * This test examines the following scenarios:
     * 1. Able to insert one tag (Tag 1) and one monument (Monument 1) association
     * 2. Able to update that same first tag (Tag 1) with a different monument (Monument 2)
     * 3. Able to insert a new tag (Tag 2) and associate it with the first monument (Monument 1)
     * 4. Unable to insert a duplicate tag (Tag 3) and associate it with the first monument (Monument 1)
     * 5. Unable to insert a duplicate tag (Tag 3) and associate it with the second monument (Monument 2)
     */
    @Test
    public void testMonumentTag_ExpectedConstraintViolationException_MonumentIdTagId() {
        /**
         * TODO: Replace this with repository instead of service
        Tag tag1 = new Tag();
        tag1.setName("Tag 1");

        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");

        tag1.addMonument(monument1);

        Integer monument1Id = this.monumentService.insert(monument1);
        Integer tag1Id = this.tagService.insert(tag1);

        List<Monument> monumentResults = this.tagService.get(tag1Id, true).getMonuments();

        assertEquals(1, monumentResults.size());
        assertEquals(monument1.getTitle(), monumentResults.get(0).getTitle());

        List<Tag> tagResults = this.monumentService.get(monument1Id, true).getTags();

        assertEquals(1, tagResults.size());
        assertEquals(tag1.getName(), tagResults.get(0).getName());

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");

        Integer monument2Id = this.monumentService.insert(monument2);

        tag1 = this.tagService.get(tag1Id, true);
        tag1.addMonument(monument2);

        this.tagService.update(tag1);

        monumentResults = this.tagService.get(tag1Id, true).getMonuments();

        assertEquals(2, monumentResults.size());

        ArrayList<String> expectedTitles = new ArrayList<>();
        expectedTitles.add(monument1.getTitle());
        expectedTitles.add(monument2.getTitle());

        for (Monument monumentResult : monumentResults) {
            assertTrue(expectedTitles.contains(monumentResult.getTitle()));
        }

        tagResults = this.monumentService.get(monument1Id, true).getTags();

        assertEquals(1, tagResults.size());
        assertEquals(tag1.getName(), tagResults.get(0).getName());

        tagResults = this.monumentService.get(monument2Id, true).getTags();

        assertEquals(1, tagResults.size());
        assertEquals(tag1.getName(), tagResults.get(0).getName());

        Tag tag2 = new Tag();
        tag2.setName("Tag 2");

        tag2.addMonument(monument1);

        Integer tag2Id = this.tagService.insert(tag2);

        monumentResults = this.tagService.get(tag2Id, true).getMonuments();

        assertEquals(1, monumentResults.size());
        assertEquals(monument1.getTitle(), monumentResults.get(0).getTitle());

        tagResults = this.monumentService.get(monument1Id, true).getTags();

        assertEquals(2, tagResults.size());

        ArrayList<String> expectedTagNames = new ArrayList<>();
        expectedTagNames.add(tag1.getName());
        expectedTagNames.add(tag2.getName());

        for (Tag tagResult : tagResults) {
            assertTrue(expectedTagNames.contains(tagResult.getName()));
        }

        Tag tag3 = new Tag();
        tag3.setName("Tag 1");

        tag3.addMonument(monument1);

        boolean caughtException = false;

        try {
            this.tagService.insert(tag3);
        } catch (ConstraintViolationException e) {
            caughtException = true;
        }

        if (!caughtException) {
            fail("Did not catch ConstraintViolationException when attempting to insert duplicate Tag");
        }

        tag3.setMonuments(new ArrayList<>());
        tag3.addMonument(monument2);

        caughtException = false;

        try {
            this.tagService.insert(tag3);
        } catch (ConstraintViolationException e) {
            caughtException = true;
        }

        if (!caughtException) {
            fail("Did not catch ConstraintViolationException when attempting to insert duplicate Tag");
        }
         */
    }
}
