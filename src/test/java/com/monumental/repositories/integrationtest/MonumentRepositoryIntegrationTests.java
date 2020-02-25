package com.monumental.repositories.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.repositories.MonumentRepository;
import com.monumental.services.TagService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.persistence.Tuple;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

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

    /* getRelatedMonuments Tests */

    @Test
    public void testMonumentRepository_getRelatedMonuments_EmptyTagsList() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument = this.monumentRepository.save(monument);

        List<Tuple> results = this.monumentRepository.getRelatedMonuments(new ArrayList<>(), monument.getId(), PageRequest.of(0, 1000));

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentRepository_getRelatedMonuments_NoAssociatedTags() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument = this.monumentRepository.save(monument);

        this.tagService.createTag("Tag", new ArrayList<>(), false);

        List<String> tagNames = new ArrayList<>();
        tagNames.add("Tag");

        List<Tuple> results = this.monumentRepository.getRelatedMonuments(tagNames, monument.getId(), PageRequest.of(0, 1000));

        assertEquals(0, results.size());
    }

    @Test
    public void testMonumentRepository_getRelatedMonuments_NoRelatedMonuments() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2 = this.monumentRepository.save(monument2);

        List<Monument> monument1List = new ArrayList<>();
        monument1List.add(monument1);

        List<Monument> monument2List = new ArrayList<>();
        monument2List.add(monument2);

        Tag tag1 = this.tagService.createTag("Tag 1", monument1List, false);

        List<String> tag1NameList = new ArrayList<>();
        tag1NameList.add(tag1.getName());

        Tag tag2 = this.tagService.createTag("Tag 2", monument2List, false);

        List<String> tag2NameList = new ArrayList<>();
        tag2NameList.add(tag2.getName());

        List<Tuple> monument1Results = this.monumentRepository.getRelatedMonuments(tag1NameList, monument1.getId(), PageRequest.of(0, 1000));

        assertEquals(0, monument1Results.size());

        List<Tuple> monument2Results = this.monumentRepository.getRelatedMonuments(tag2NameList, monument2.getId(), PageRequest.of(0, 1000));

        assertEquals(0, monument2Results.size());
    }

    @Test
    public void testMonumentRepository_getRelatedMonuments_TwoMonumentsRelated() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2 = this.monumentRepository.save(monument2);

        List<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);
        monuments.add(monument2);

        Tag tag = this.tagService.createTag("Tag", monuments, false);

        List<String> tagNames = new ArrayList<>();
        tagNames.add(tag.getName());

        List<Tuple> monument1Results = this.monumentRepository.getRelatedMonuments(tagNames, monument1.getId(), PageRequest.of(0, 1000));

        assertEquals(1, monument1Results.size());

        Tuple monument1Result = monument1Results.get(0);
        Monument monument1ResultMonument = (Monument) monument1Result.get(0);
        long monument1ResultMatchingTagCount = (long) monument1Result.get(1);

        assertEquals(monument2.getTitle(), monument1ResultMonument.getTitle());
        assertEquals(1, monument1ResultMatchingTagCount);

        List<Tuple> monument2Results = this.monumentRepository.getRelatedMonuments(tagNames, monument2.getId(), PageRequest.of(0, 1000));

        assertEquals(1, monument2Results.size());

        Tuple monument2Result = monument2Results.get(0);
        Monument monument2ResultMonument = (Monument) monument2Result.get(0);
        long monument2ResultMatchingTagCount = (long) monument2Result.get(1);

        assertEquals(monument1.getTitle(), monument2ResultMonument.getTitle());
        assertEquals(1, monument2ResultMatchingTagCount);
    }

    @Test
    public void testMonumentRepository_getRelatedMonuments_ThreeMonuments_TwoRelated() {
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
        monuments.add(monument3);

        List<Monument> monument2List = new ArrayList<>();
        monument2List.add(monument2);

        Tag tag1 = this.tagService.createTag("Tag 1", monuments, false);

        Tag tag2 = this.tagService.createTag("Tag 2", monument2List, false);

        List<String> tag1NameList = new ArrayList<>();
        tag1NameList.add(tag1.getName());

        List<String> tag2NameList = new ArrayList<>();
        tag2NameList.add(tag2.getName());

        List<Tuple> monument1Results = this.monumentRepository.getRelatedMonuments(tag1NameList, monument1.getId(), PageRequest.of(0, 1000));

        assertEquals(1, monument1Results.size());

        Tuple monument1Result = monument1Results.get(0);
        Monument monument1ResultMonument = (Monument) monument1Result.get(0);
        long monument1ResultMatchingTagCount = (long) monument1Result.get(1);

        assertEquals(monument3.getTitle(), monument1ResultMonument.getTitle());
        assertEquals(1, monument1ResultMatchingTagCount);

        List<Tuple> monument2Results = this.monumentRepository.getRelatedMonuments(tag2NameList, monument2.getId(), PageRequest.of(0, 1000));

        assertEquals(0, monument2Results.size());

        List<Tuple> monument3Results = this.monumentRepository.getRelatedMonuments(tag1NameList, monument3.getId(), PageRequest.of(0, 1000));

        assertEquals(1, monument3Results.size());

        Tuple monument3Result = monument3Results.get(0);
        Monument monument3ResultMonument = (Monument) monument3Result.get(0);
        long monument3ResultMatchingTagCount = (long) monument3Result.get(1);

        assertEquals(monument1.getTitle(), monument3ResultMonument.getTitle());
        assertEquals(1, monument3ResultMatchingTagCount);
    }

    @Test
    public void testMonumentRepository_getRelatedMonuments_FiveMonuments_VariousRelations_CorrectMatchingTagCountOrdering() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2 = this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3 = this.monumentRepository.save(monument3);

        Monument monument4 = new Monument();
        monument4.setTitle("Monument 4");
        monument4 = this.monumentRepository.save(monument4);

        Monument monument5 = new Monument();
        monument5.setTitle("Monument 5");
        monument5 = this.monumentRepository.save(monument5);

        List<Monument> monumentsForTag1 = new ArrayList<>();
        monumentsForTag1.add(monument1);
        monumentsForTag1.add(monument2);
        monumentsForTag1.add(monument3);
        monumentsForTag1.add(monument4);
        monumentsForTag1.add(monument5);

        List<Monument> monumentsForTag2 = new ArrayList<>();
        monumentsForTag2.add(monument1);
        monumentsForTag2.add(monument3);
        monumentsForTag2.add(monument4);
        monumentsForTag2.add(monument5);

        List<Monument> monumentsForTag3 = new ArrayList<>();
        monumentsForTag3.add(monument1);
        monumentsForTag3.add(monument4);
        monumentsForTag3.add(monument5);

        List<Monument> monumentsForTag4 = new ArrayList<>();
        monumentsForTag4.add(monument1);
        monumentsForTag4.add(monument5);

        Tag tag1 = this.tagService.createTag("Tag 1", monumentsForTag1, false);
        Tag tag2 = this.tagService.createTag("Tag 2", monumentsForTag2, false);
        Tag tag3 = this.tagService.createTag("Tag 3", monumentsForTag3, false);
        Tag tag4 = this.tagService.createTag("Tag 4", monumentsForTag4, false);

        List<String> tagNames = new ArrayList<>();
        tagNames.add(tag1.getName());
        tagNames.add(tag2.getName());
        tagNames.add(tag3.getName());
        tagNames.add(tag4.getName());

        List<Tuple> monument1RelatedMonuments = this.monumentRepository.getRelatedMonuments(tagNames, monument1.getId(), PageRequest.of(0, 1000));

        assertEquals(4, monument1RelatedMonuments.size());

        Tuple monument1FirstRelatedMonumentTuple = monument1RelatedMonuments.get(0);
        Monument monument1FirstRelatedMonument = (Monument) monument1FirstRelatedMonumentTuple.get(0);
        long monument1FirstRelatedMonumentMatchingTagCount = (long) monument1FirstRelatedMonumentTuple.get(1);

        assertEquals(monument5.getTitle(), monument1FirstRelatedMonument.getTitle());
        assertEquals(4, monument1FirstRelatedMonumentMatchingTagCount);

        Tuple monument1SecondRelatedMonumentTuple = monument1RelatedMonuments.get(1);
        Monument monument1SecondRelatedMonument = (Monument) monument1SecondRelatedMonumentTuple.get(0);
        long monument1SecondRelatedMonumentMatchingTagCount = (long) monument1SecondRelatedMonumentTuple.get(1);

        assertEquals(monument4.getTitle(), monument1SecondRelatedMonument.getTitle());
        assertEquals(3, monument1SecondRelatedMonumentMatchingTagCount);

        Tuple monument1ThirdRelatedMonumentTuple = monument1RelatedMonuments.get(2);
        Monument monument1ThirdRelatedMonument = (Monument) monument1ThirdRelatedMonumentTuple.get(0);
        long monument1ThirdRelatedMonumentMatchingTagCount = (long) monument1ThirdRelatedMonumentTuple.get(1);

        assertEquals(monument3.getTitle(), monument1ThirdRelatedMonument.getTitle());
        assertEquals(2, monument1ThirdRelatedMonumentMatchingTagCount);

        Tuple monument1FourthRelatedMonumentTuple = monument1RelatedMonuments.get(3);
        Monument monument1FourthRelatedMonument = (Monument) monument1FourthRelatedMonumentTuple.get(0);
        long monument1FourthRelatedMonumentMatchingTagCount = (long) monument1FourthRelatedMonumentTuple.get(1);

        assertEquals(monument2.getTitle(), monument1FourthRelatedMonument.getTitle());
        assertEquals(1, monument1FourthRelatedMonumentMatchingTagCount);
    }
}