package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.repositories.MonumentRepository;
import com.monumental.services.MonumentService;
import com.monumental.repositories.TagRepository;
import com.monumental.services.TagService;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;

@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class TagServiceIntegrationTests {

    @Autowired
    private TagService tagService;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private MonumentService monumentService;

    @Autowired
    private MonumentRepository monumentRepository;


    /**
     * Tests TagService's getByMonumentId and the underlying ModelService's getByJoinTable
     */
    @Test
    @Transactional
    public void testTagService_GetByMonumentId() {
        List<Monument> monuments = setupMonumentsAndTags();
        assertEquals(2, monuments.size());

        List<Tag> firstTags = tagRepository.getAllByMonumentId(monuments.get(0).getId());
        assertEquals(2, firstTags.size());
        for (Tag tag : firstTags) {
            assert(Arrays.asList("tag1", "tag2").contains(tag.getName()));
            boolean hasMonument = false;
            for (Monument monument : tag.getMonuments()) {
                if (monument.getId().equals(monuments.get(0).getId())) {
                    hasMonument = true;
                    break;
                }
            }
            assert(hasMonument);
        }

        List<Tag> secondTags = tagRepository.getAllByMonumentId(monuments.get(1).getId());
        assertEquals(1, secondTags.size());
        assertEquals("tag2", secondTags.get(0).getName());
        boolean hasMonument = false;
        for (Monument monument : secondTags.get(0).getMonuments()) {
            if (monument.getId().equals(monuments.get(1).getId())) {
                hasMonument = true;
                break;
            }
        }
        assert(hasMonument);
    }

    /** getTagsByName Tests **/

    @Test
    public void testTagService_getTagsByName_SingleRecordReturned() {
        Tag tag = new Tag();
        tag.setName("Tag");

        this.tagRepository.save(tag);

        List<Tag> results = this.tagRepository.getAllByName(tag.getName());

        assertEquals(1, results.size());
        assertEquals(tag.getName(), results.get(0).getName());
    }

    /** Tag Unique Constraint Tests **/

    /**
     * TODO: Replace this with repository instead of service
    @Test(expected = ConstraintViolationException.class)
    public void testTagService_ExceptedConstraintViolationException_Name() {
        Tag tag1 = new Tag();
        tag1.setName("Tag");

        this.tagService.insert(tag1);

        Tag tag2 = new Tag();
        tag2.setName("Tag");

        this.tagService.insert(tag2);
    }
     */

    @Test
    public void testTagService_CatchConstraintViolationException_Name() {
        Tag tag1 = new Tag();
        tag1.setName("Tag");

        this.tagRepository.save(tag1);

        Tag tag2 = new Tag();
        tag2.setName("Tag");

        try {
            this.tagRepository.save(tag2);
        } catch (ConstraintViolationException e) {
            assertEquals(1, this.tagService.getAll().size());
        }
    }

    /**
     * Helper that sets up 2 Monuments and 2 Tags, with 1 Tags related to both Monuments
     */
    private List<Monument> setupMonumentsAndTags() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1.setArtist("Artist 1");

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2.setArtist("Artist 2");

        List<Monument> monuments = new ArrayList<>();
        monumentRepository.saveAll(Arrays.asList(monument1, monument2))
            .forEach(monuments::add);
        monument1 = monuments.get(0);
        monument2 = monuments.get(1);

        Tag tag1 = new Tag();
        tag1.setMonuments(Arrays.asList(monument1));
        tag1.setName("tag1");

        Tag tag2 = new Tag();
        tag2.setMonuments(Arrays.asList(monument1, monument2));
        tag2.setName("tag2");

        tagRepository.saveAll(Arrays.asList(tag1, tag2));

        return monuments;
    }
}
