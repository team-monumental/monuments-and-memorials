package com.monumental.repositories.integrationtest;

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
    private TagService tagService;

    /* getAllByTagId Tests */

    @Test
    public void testMonumentRepository_getAllByTagId_OneMonument_OneTag() {
        Monument monument = new Monument();
        monument.setTitle("Monument 1");
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        Tag tag = this.tagService.createTag("Tag 1", monuments, false);

        List<Monument> results = this.monumentRepository.getAllByTagId(tag.getId());

        assertEquals(1, results.size());

        Monument result = results.get(0);

        assertEquals(monument.getTitle(), result.getTitle());
    }

    @Test
    public void testMonumentRepository_getAllByTagId_OneMonument_NoTags() {
        Monument monument = new Monument();
        monument.setTitle("Monument 1");

        this.monumentRepository.save(monument);

        List<Monument> results = this.monumentRepository.getAllByTagId(1);

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentRepository_getAllByTagId_NoMonument_OneTag() {
        Tag tag = this.tagService.createTag("Tag 1", new ArrayList<>(), false);

        List<Monument> results = this.monumentRepository.getAllByTagId(tag.getId());

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentRepository_getAllByTagId_OneMonument_ThreeTags() {
        Monument monument = new Monument();
        monument.setTitle("Monument 1");
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        Tag tag1 = this.tagService.createTag("Tag 1", monuments, false);
        Tag tag2 = this.tagService.createTag("Tag 2", monuments, false);
        Tag tag3 = this.tagService.createTag("Tag 3", monuments, false);

        List<Monument> tag1Monuments = this.monumentRepository.getAllByTagId(tag1.getId());
        assertEquals(1, tag1Monuments.size());
        assertEquals(monument.getTitle(), tag1Monuments.get(0).getTitle());

        List<Monument> tag2Monuments = this.monumentRepository.getAllByTagId(tag2.getId());
        assertEquals(1, tag2Monuments.size());
        assertEquals(monument.getTitle(), tag2Monuments.get(0).getTitle());

        List<Monument> tag3Monuments = this.monumentRepository.getAllByTagId(tag3.getId());
        assertEquals(1, tag3Monuments.size());
        assertEquals(monument.getTitle(), tag3Monuments.get(0).getTitle());
    }

    @Test
    public void testMonumentRepository_getAllByTagId_ThreeMonuments_OneTag() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2 = this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3 = this.monumentRepository.save(monument3);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);
        monuments.add(monument2);
        monuments.add(monument3);

        Tag tag = this.tagService.createTag("Tag 1", monuments, false);

        List<Monument> results = this.monumentRepository.getAllByTagId(tag.getId());

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
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2 = this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3 = this.monumentRepository.save(monument3);

        // Monument 1 gets all of the Tags
        List<Monument> monument1List = new ArrayList<>();
        monument1List.add(monument1);

        Tag tag1 = this.tagService.createTag("Tag 1", monument1List, false);
        Tag tag2 = this.tagService.createTag("Tag 2", monument1List, false);
        Tag tag3 = this.tagService.createTag("Tag 3", monument1List, false);

        // Monument 2 gets none of the Tags

        // Monument 3 gets Tag 2
        List<Monument> monument3List = new ArrayList<>();
        monument3List.add(monument3);

        this.tagService.createTag("Tag 2", monument3List, false);

        List<Monument> tag1Monuments = this.monumentRepository.getAllByTagId(tag1.getId());
        assertEquals(1, tag1Monuments.size());
        assertEquals(monument1.getTitle(), tag1Monuments.get(0).getTitle());

        List<Monument> tag2Monuments = this.monumentRepository.getAllByTagId(tag2.getId());
        assertEquals(2, tag2Monuments.size());

        List<Monument> tag3Monuments = this.monumentRepository.getAllByTagId(tag3.getId());
        assertEquals(1, tag3Monuments.size());
        assertEquals(monument1.getTitle(), tag3Monuments.get(0).getTitle());
    }
}
