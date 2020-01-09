package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.repositories.MonumentRepository;
import com.monumental.repositories.TagRepository;
import com.monumental.services.TagService;
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
 * Test class used to integration test TagService
 * Makes use of an in-memory H2 database as to not ruin the real one
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class TagServiceIntegrationTests {

    @Autowired
    TagService tagService;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    MonumentRepository monumentRepository;

    @Test
    public void testTagService_createTag_NullName() {
        assertNull(this.tagService.createTag(null, new ArrayList<>(), false));
    }

    @Test
    public void testTagService_createTag_NullMonuments() {
        assertNull(this.tagService.createTag("Tag", null, false));
    }

    @Test
    public void testTagService_createTag_NewTagCreated() {
        Monument monument = this.makeTestMonument("Monument 1");

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        monument = this.monumentRepository.save(monument);

        this.tagService.createTag("Tag 1", monuments, false);

        assertEquals(1, this.tagRepository.findAll().size());
        assertEquals(1, this.tagRepository.getAllByName("Tag 1").size());
        assertEquals(1, this.tagRepository.getAllByMonumentId(monument.getId()).size());
    }

    @Test
    public void testTagService_createTag_NewMaterialCreated() {
        Monument monument = this.makeTestMonument("Monument 1");

        List<Monument> monuments  = new ArrayList<>();
        monuments.add(monument);

        monument = this.monumentRepository.save(monument);

        this.tagService.createTag("Material 1", monuments, true);

        assertEquals(1, this.tagRepository.findAll().size());
        assertEquals(1, this.tagRepository.getAllByName("Material 1").size());
        assertEquals(1, this.tagRepository.getAllByMonumentId(monument.getId()).size());
    }

    @Test
    public void testTagService_createTag_NewTagCreated_NewMaterialCreated() {
        Monument monument = this.makeTestMonument("Monument 1");

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        monument = this.monumentRepository.save(monument);

        this.tagService.createTag("Tag 1", monuments, false);
        this.tagService.createTag("Material 1", monuments, true);

        assertEquals(2, this.tagRepository.findAll().size());
        assertEquals(1, this.tagRepository.getAllByName("Tag 1").size());
        assertEquals(1, this.tagRepository.getAllByName("Material 1").size());
        assertEquals(2, this.tagRepository.getAllByMonumentId(monument.getId()).size());
    }

    @Test
    public void testTagService_createTag_DuplicateTagsCreated() {
        Monument monument1 = this.makeTestMonument("Monument 1");
        Monument monument2 = this.makeTestMonument("Monument 2");

        List<Monument> monuments1 = new ArrayList<>();
        monuments1.add(monument1);

        List<Monument> monuments2 = new ArrayList<>();
        monuments2.add(monument2);

        monument1 = this.monumentRepository.save(monument1);
        monument2 = this.monumentRepository.save(monument2);

        this.tagService.createTag("Tag 1", monuments1, false);
        this.tagService.createTag("Tag 1", monuments2, false);

        assertEquals(1, this.tagRepository.findAll().size());
        assertEquals(1, this.tagRepository.getAllByName("Tag 1").size());
        assertEquals(1, this.tagRepository.getAllByMonumentId(monument1.getId()).size());
        assertEquals(1, this.tagRepository.getAllByMonumentId(monument2.getId()).size());
    }

    @Test
    public void testTagService_createTag_DuplicateMaterialsCreated() {
        Monument monument1 = this.makeTestMonument("Monument 1");
        Monument monument2 = this.makeTestMonument("Monument 2");

        List<Monument> monuments1 = new ArrayList<>();
        monuments1.add(monument1);

        List<Monument> monuments2 = new ArrayList<>();
        monuments2.add(monument2);

        monument1 = this.monumentRepository.save(monument1);
        monument2 = this.monumentRepository.save(monument2);

        this.tagService.createTag("Material 1", monuments1, true);
        this.tagService.createTag("Material 1", monuments2, true);

        assertEquals(1, this.tagRepository.findAll().size());
        assertEquals(1, this.tagRepository.getAllByName("Material 1").size());
        assertEquals(1, this.tagRepository.getAllByMonumentId(monument1.getId()).size());
        assertEquals(1, this.tagRepository.getAllByMonumentId(monument2.getId()).size());
    }

    @Test
    public void testTagService_createTag_DuplicateTagsCreated_DuplicateMaterialsCreated() {
        Monument monument1 = this.makeTestMonument("Monument 1");
        Monument monument2 = this.makeTestMonument("Monument 2");

        List<Monument> monuments1 = new ArrayList<>();
        monuments1.add(monument1);

        List<Monument> monuments2 = new ArrayList<>();
        monuments2.add(monument2);

        monument1 = this.monumentRepository.save(monument1);
        monument2 = this.monumentRepository.save(monument2);

        this.tagService.createTag("Tag 1", monuments1, false);
        this.tagService.createTag("Tag 1", monuments2, false);

        this.tagService.createTag("Material 1", monuments1, true);
        this.tagService.createTag("Material 1", monuments2, true);

        assertEquals(2, this.tagRepository.findAll().size());
        assertEquals(1, this.tagRepository.getAllByName("Tag 1").size());
        assertEquals(1, this.tagRepository.getAllByName("Material 1").size());
        assertEquals(2, this.tagRepository.getAllByMonumentId(monument1.getId()).size());
        assertEquals(2, this.tagRepository.getAllByMonumentId(monument2.getId()).size());
    }

    @Test
    public void testTagService_createTag_TagAndMaterialCreatedWithSameName() {
        Monument monument = this.makeTestMonument("Monument 1");

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        monument = this.monumentRepository.save(monument);

        this.tagService.createTag("Name", monuments, false);
        this.tagService.createTag("Name", monuments, true);

        assertEquals(2, this.tagRepository.findAll().size());
        assertEquals(2, this.tagRepository.getAllByName("Name").size());
        assertEquals(2, this.tagRepository.getAllByMonumentId(monument.getId()).size());
    }

    /** removeTagFromMonument Tests **/

    @Test
    public void testTagService_removeTagFromMonument_NullTag_NullMonument() {
        assertNull(this.tagService.removeTagFromMonument(null, null));
    }

    @Test
    public void testTagService_removeTagFromMonument_NonNullTag_NullMonument() {
        Tag tag = new Tag();

        assertNull(this.tagService.removeTagFromMonument(tag, null));
    }

    @Test
    public void testTagService_removeTagFromMonument_NullTag_NonNullMonument() {
        Monument monument = new Monument();

        assertNull(this.tagService.removeTagFromMonument(null, monument));
    }

    @Test
    public void testTagService_removeTagFromMonument_NullMonumentTags() {
        Tag tag = new Tag();
        tag.setMonumentTags(null);

        Monument monument = new Monument();

        assertNull(this.tagService.removeTagFromMonument(tag, monument));
    }

    @Test
    public void testTagService_removeTagFromMonument_EmptyMonumentTags() {
        Tag tag = new Tag();
        Monument monument = new Monument();

        assertNull(this.tagService.removeTagFromMonument(tag, monument));
    }

    @Test
    public void testTagService_removeTagFromMonument_OneTagRemoved() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        Tag tag = this.tagService.createTag("Tag", monuments, false);

        Tag result = this.tagService.removeTagFromMonument(tag, monument);

        assertEquals(0, result.getMonumentTags().size());
        assertEquals(0, result.getMonuments().size());
        assertEquals(0, this.tagRepository.getAllByMonumentId(monument.getId()).size());
        assertEquals(0, this.monumentRepository.getAllByTagId(result.getId()).size());
    }

    @Test
    public void testTagService_removeTagFromMonument_NoTagsRemoved() {
        Monument monument1 = new Monument();
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2 = this.monumentRepository.save(monument2);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);

        Tag tag = this.tagService.createTag("Tag", monuments, false);

        Tag result = this.tagService.removeTagFromMonument(tag, monument2);

        assertEquals(1, result.getMonumentTags().size());
        assertEquals(1, result.getMonuments().size());
        assertEquals(1, this.tagRepository.getAllByMonumentId(monument1.getId()).size());
        assertEquals(1, this.monumentRepository.getAllByTagId(result.getId()).size());
    }

    @Test
    public void testTagService_removeTagFromMonument_TwoTags_OneTagRemoved() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        Tag tag1 = this.tagService.createTag("Tag 1", monuments, false);
        Tag tag2 = this.tagService.createTag("Tag 2", monuments, false);

        Tag result = this.tagService.removeTagFromMonument(tag1, monument);

        assertEquals(0, result.getMonumentTags().size());
        assertEquals(1, tag2.getMonumentTags().size());

        assertEquals(0, result.getMonuments().size());
        assertEquals(1, tag2.getMonuments().size());

        assertEquals(1, this.tagRepository.getAllByMonumentId(monument.getId()).size());

        assertEquals(0, this.monumentRepository.getAllByTagId(result.getId()).size());
        assertEquals(1, this.monumentRepository.getAllByTagId(tag2.getId()).size());
    }

    @Test
    public void testTagService_removeTagFromMonument_ThreeTags_TwoRemoved() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        Tag tag1 = this.tagService.createTag("Tag 1", monuments, false);
        Tag tag2 = this.tagService.createTag("Tag 2", monuments, false);
        Tag tag3 = this.tagService.createTag("Tag 3", monuments, false);

        tag1 = this.tagService.removeTagFromMonument(tag1, monument);
        tag3 = this.tagService.removeTagFromMonument(tag3, monument);

        assertEquals(0, tag1.getMonumentTags().size());
        assertEquals(1, tag2.getMonumentTags().size());
        assertEquals(0, tag3.getMonumentTags().size());

        assertEquals(0, tag1.getMonuments().size());
        assertEquals(1, tag2.getMonuments().size());
        assertEquals(0, tag3.getMonuments().size());

        assertEquals(1, this.tagRepository.getAllByMonumentId(monument.getId()).size());

        assertEquals(0, this.monumentRepository.getAllByTagId(tag1.getId()).size());
        assertEquals(1, this.monumentRepository.getAllByTagId(tag2.getId()).size());
        assertEquals(0, this.monumentRepository.getAllByTagId(tag3.getId()).size());
    }

    @Test
    public void testTagService_removeTagFromMonument_ThreeTags_ThreeMonuments() {
        Monument monument1 = new Monument();
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2 = this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3 = this.monumentRepository.save(monument3);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);
        monuments.add(monument2);
        monuments.add(monument3);

        Tag tag1 = this.tagService.createTag("Tag 1", monuments, false);
        Tag tag2 = this.tagService.createTag("Tag 2", monuments, false);
        Tag tag3 = this.tagService.createTag("Tag 3", monuments, false);

        tag1 = this.tagService.removeTagFromMonument(tag1, monument1);

        tag3 = this.tagService.removeTagFromMonument(tag3, monument1);
        tag3 = this.tagService.removeTagFromMonument(tag3, monument2);
        tag3 = this.tagService.removeTagFromMonument(tag3, monument3);

        assertEquals(2, tag1.getMonumentTags().size());
        assertEquals(3, tag2.getMonumentTags().size());
        assertEquals(0, tag3.getMonumentTags().size());

        assertEquals(2, tag1.getMonuments().size());
        assertEquals(3, tag2.getMonuments().size());
        assertEquals(0, tag3.getMonuments().size());

        assertEquals(1, this.tagRepository.getAllByMonumentId(monument1.getId()).size());
        assertEquals(2, this.tagRepository.getAllByMonumentId(monument2.getId()).size());
        assertEquals(2, this.tagRepository.getAllByMonumentId(monument3.getId()).size());

        assertEquals(2, this.monumentRepository.getAllByTagId(tag1.getId()).size());
        assertEquals(3, this.monumentRepository.getAllByTagId(tag2.getId()).size());
        assertEquals(0, this.monumentRepository.getAllByTagId(tag3.getId()).size());
    }

    /**
     * Helper function to make a test Monument object with the specified title
     * @param title - String for the title to use to make the Monument
     * @return Monument - Monument test object
     */
    private Monument makeTestMonument(String title) {
        Monument monument = new Monument();
        monument.setTitle(title);
        return monument;
    }
}