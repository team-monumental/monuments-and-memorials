package com.monumental.services.integrationtest;

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
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Test class used to integration test the monument_tag Join Table
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class MonumentTagIntegrationTests {

    @Autowired
    MonumentRepository monumentRepository;

    @Autowired
    TagRepository tagRepository;

    /* Monument_Tag Unique Constraint Tests **/

    /**
     * This test examines the following scenarios:
     * 1. Able to save one tag (Tag 1) and one monument (Monument 1) association
     * 2. Able to save that same first tag (Tag 1) with a different monument (Monument 2)
     * 3. Able to save a new tag (Tag 2) and associate it with the first monument (Monument 1)
     * 4. Unable to save a duplicate tag (Tag 3) and associate it with the first monument (Monument 1)
     * 5. Unable to save a duplicate tag (Tag 3) and associate it with the second monument (Monument 2)
     */
    @Test
    public void testMonumentTag_ExpectedConstraintViolationException_MonumentIdTagId() {
        Tag tag1 = new Tag();
        tag1.setName("Tag 1");

        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");

        tag1.addMonument(monument1);

        monument1 = this.monumentRepository.save(monument1);
        tag1 = this.tagRepository.save(tag1);

        List<Monument> monumentResults = this.monumentRepository.getAllByTagId(tag1.getId());

        assertEquals(1, monumentResults.size());
        assertEquals(monument1.getTitle(), monumentResults.get(0).getTitle());

        List<Tag> tagResults = this.tagRepository.getAllByMonumentId(monument1.getId());

        assertEquals(1, tagResults.size());
        assertEquals(tag1.getName(), tagResults.get(0).getName());

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");

        monument2 = this.monumentRepository.save(monument2);

        Optional<Tag> optional = this.tagRepository.findById(tag1.getId());
        assert(optional.isPresent());
        tag1 = optional.get();
        tag1.addMonument(monument2);

        this.tagRepository.save(tag1);

        monumentResults = this.monumentRepository.getAllByTagId(tag1.getId());

        assertEquals(2, monumentResults.size());

        ArrayList<String> expectedTitles = new ArrayList<>();
        expectedTitles.add(monument1.getTitle());
        expectedTitles.add(monument2.getTitle());

        for (Monument monumentResult : monumentResults) {
            assertTrue(expectedTitles.contains(monumentResult.getTitle()));
        }

        tagResults = this.tagRepository.getAllByMonumentId(monument1.getId());

        assertEquals(1, tagResults.size());
        assertEquals(tag1.getName(), tagResults.get(0).getName());

        tagResults = this.tagRepository.getAllByMonumentId(monument2.getId());

        assertEquals(1, tagResults.size());
        assertEquals(tag1.getName(), tagResults.get(0).getName());

        Tag tag2 = new Tag();
        tag2.setName("Tag 2");

        tag2.addMonument(monument1);

        tag2 = this.tagRepository.save(tag2);

        monumentResults = this.monumentRepository.getAllByTagId(tag2.getId());

        assertEquals(1, monumentResults.size());
        assertEquals(monument1.getTitle(), monumentResults.get(0).getTitle());

        tagResults = this.tagRepository.getAllByMonumentId(monument1.getId());

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

        /* TODO: Rewrite this to check if the duplicate tag was not created, rather than an exception was thrown
        try {
            this.tagRepository.save(tag3);
        } catch (ConstraintViolationException e) {
            caughtException = true;
        }

        if (!caughtException) {
            fail("Did not catch ConstraintViolationException when attempting to save duplicate Tag");
        }

        tag3.setMonuments(new ArrayList<>());
        tag3.addMonument(monument2);

        caughtException = false;

        try {
            this.tagRepository.save(tag3);
        } catch (ConstraintViolationException e) {
            caughtException = true;
        }

        if (!caughtException) {
            fail("Did not catch ConstraintViolationException when attempting to save duplicate Tag");
        }
         */
    }
}
