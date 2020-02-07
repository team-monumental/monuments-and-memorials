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

import static org.junit.Assert.assertEquals;

/**
 * Test class for integration testing the TagRepository class and its connection with the database
 * These tests utilize an H2 in-memory database as to no ruin the real one
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class TagRepositoryIntegrationTests {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private MonumentRepository monumentRepository;

    @Autowired
    private TagService tagService;

    /* getAllByMonumentId Tests */

    @Test
    public void testTagRepository_getAllByMonumentId_NoTagsWithMonumentId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        this.tagService.createTag("Tag", new ArrayList<>(), false);

        assertEquals(0, this.tagRepository.getAllByMonumentId(monument.getId()).size());
    }

    @Test
    public void testTagRepository_getAllByMonumentId_OneTagWithMonumentId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        this.tagService.createTag("Tag", monuments, false);

        assertEquals(1, this.tagRepository.getAllByMonumentId(monument.getId()).size());
    }

    @Test
    public void testTagRepository_getAllByMonumentId_ThreeTagsWithMonumentId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        this.tagService.createTag("Tag 1", monuments, false);
        this.tagService.createTag("Tag 2", monuments, false);
        this.tagService.createTag("Tag 3", monuments, false);

        assertEquals(3, this.tagRepository.getAllByMonumentId(monument.getId()).size());
    }

    /** getAllByName Tests **/

    @Test
    public void testTagRepository_getAllByName_SingleRecordReturned() {
        Tag tag = new Tag();
        tag.setName("Tag");

        this.tagRepository.save(tag);

        List<Tag> results = this.tagRepository.getAllByName(tag.getName());

        assertEquals(1, results.size());
        assertEquals(tag.getName(), results.get(0).getName());
    }
}
