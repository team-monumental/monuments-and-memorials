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

    /* getAllByMonumentIdAndIsMaterial Tests **/

    @Test
    public void testTagRepository_getAllByMonumentIdAndIsMaterial_NoTagsWithMonumentId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        this.tagService.createTag("Tag", new ArrayList<>(), false);

        assertEquals(0, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), false).size());
    }

    @Test
    public void testTagRepository_getAllByMonumentIdAndIsMaterial_OneTagWithMonumentId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        this.tagService.createTag("Tag", monuments, false);

        assertEquals(1, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), false).size());
        assertEquals(0, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), true).size());
    }

    @Test
    public void testTagRepository_getAllByMonumentIdAndIsMaterial_OneMaterialWithMonumentId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        this.tagService.createTag("Material", monuments, true);

        assertEquals(0, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), false).size());
        assertEquals(1, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), true).size());
    }

    @Test
    public void testTagRepository_getAllByMonumentIdAndIsMaterial_TwoTagsWithMonumentId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        this.tagService.createTag("Tag 1", monuments, false);
        this.tagService.createTag("Tag 2", monuments, false);

        assertEquals(2, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), false).size());
        assertEquals(0, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), true).size());
    }

    @Test
    public void testTagRepository_getAllByMonumentIdAndIsMaterial_TwoMaterialsWithMonumentId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        this.tagService.createTag("Material 1", monuments, true);
        this.tagService.createTag("Material 2", monuments, true);

        assertEquals(0, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), false).size());
        assertEquals(2, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), true).size());
    }

    @Test
    public void testTagRepository_getAllByMonumentIdAndIsMaterial_VariousTagsAndMaterialsWithMonumentId() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        this.tagService.createTag("Tag 1", monuments, false);
        this.tagService.createTag("Tag 2", monuments, false);
        this.tagService.createTag("Tag 3", monuments, false);

        this.tagService.createTag("Material 1", monuments, true);
        this.tagService.createTag("Material 2", monuments, true);
        this.tagService.createTag("Material 3", monuments, true);

        assertEquals(3, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), false).size());
        assertEquals(3, this.tagRepository.getAllByMonumentIdAndIsMaterial(monument.getId(), true).size());
    }

    /** getAllOrderByMostUsedDesc Tests **/

    @Test
    public void testTagRepository_getAllOrderByMostUsedDesc_NoTags() {
        List<Object[]> result = this.tagRepository.getAllOrderByMostUsedDesc();
        assertEquals(0, result.size());
    }

    @Test
    public void testTagRepository_getAllOrderByMostUsedDesc_OneTag_NoUses() {
        this.tagService.createTag("Tag", new ArrayList<>(), false);

        List<Object[]> result = this.tagRepository.getAllOrderByMostUsedDesc();
        assertEquals(0, result.size());
    }

    @Test
    public void testTagRepository_getAllOrderByMostUsedDesc_OneTag_OneUse() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        ArrayList<Monument> monuments = new ArrayList<>();
        monuments.add(monument);

        this.tagService.createTag("Tag", monuments, false);

        List<Object[]> result = this.tagRepository.getAllOrderByMostUsedDesc();
        assertEquals(1, result.size());

        Tag tagResult = (Tag) result.get(0)[0];
        assertEquals("Tag", tagResult.getName());

        long countResult = (long) result.get(0)[1];
        assertEquals(1, countResult);
    }

    @Test
    public void testTagRepository_getAllOrderByMostUsedDesc_MultipleTags_CorrectOrdering() {
        Monument monument1 = new Monument();
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2 = this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3 = this.monumentRepository.save(monument3);

        ArrayList<Monument> tag1Monuments = new ArrayList<>();
        tag1Monuments.add(monument1);
        tag1Monuments.add(monument2);
        tag1Monuments.add(monument3);

        ArrayList<Monument> tag2Monuments = new ArrayList<>();
        tag2Monuments.add(monument1);
        tag2Monuments.add(monument2);

        ArrayList<Monument> tag3Monuments = new ArrayList<>();
        tag3Monuments.add(monument1);

        this.tagService.createTag("Tag 1", tag1Monuments, false);
        this.tagService.createTag("Tag 2", tag2Monuments, false);
        this.tagService.createTag("Tag 3", tag3Monuments, false);

        List<Object[]> result = this.tagRepository.getAllOrderByMostUsedDesc();
        assertEquals(3, result.size());

        Tag firstTagResult = (Tag) result.get(0)[0];
        assertEquals("Tag 1", firstTagResult.getName());
        long firstCountResult = (long) result.get(0)[1];
        assertEquals(3, firstCountResult);

        Tag secondTagResult = (Tag) result.get(1)[0];
        assertEquals("Tag 2", secondTagResult.getName());
        long secondCountResult = (long) result.get(1)[1];
        assertEquals(2, secondCountResult);

        Tag thirdTagResult = (Tag) result.get(2)[0];
        assertEquals("Tag 3", thirdTagResult.getName());
        long thirdCountResult = (long) result.get(2)[1];
        assertEquals(1, thirdCountResult);
    }
}
