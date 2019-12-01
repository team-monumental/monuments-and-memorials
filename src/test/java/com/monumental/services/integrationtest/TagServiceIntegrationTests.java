package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
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
