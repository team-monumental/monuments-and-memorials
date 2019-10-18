package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.services.MonumentService;
import com.monumental.services.TagService;
import org.hibernate.Hibernate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static org.junit.Assert.*;

@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class TagServiceIntegrationTests {

    @Autowired
    private TagService tagService;

    @Autowired
    private MonumentService monumentService;


    /**
     * Tests ImageService's getByMonumentId and the underlying ModelService's getByJoinTable
     */
    @Test
    public void testTagService_GetByMonumentId() {
        List<Integer> monumentIds = setupMonumentsAndTags();
        assertEquals(2, monumentIds.size());

        List<Tag> firstTags = tagService.getByMonumentId(monumentIds.get(0), true);
        assertEquals(2, firstTags.size());
        for (Tag tag : firstTags) {
            assert(Arrays.asList("tag1", "tag2").contains(tag.getName()));
            boolean hasMonument = false;
            for (Monument monument : tag.getMonuments()) {
                if (monument.getId().equals(monumentIds.get(0))) {
                    hasMonument = true;
                    break;
                }
            }
            assert(hasMonument);
        }

        List<Tag> secondTags = tagService.getByMonumentId(monumentIds.get(1), true);
        assertEquals(1, secondTags.size());
        assertEquals("tag2", secondTags.get(0).getName());
        boolean hasMonument = false;
        for (Monument monument : secondTags.get(0).getMonuments()) {
            if (monument.getId().equals(monumentIds.get(1))) {
                hasMonument = true;
                break;
            }
        }
        assert(hasMonument);
    }

    /**
     * Helper that sets up 2 Monuments and 2 Tags, with 1 Tags related to both Monuments
     */
    private List<Integer> setupMonumentsAndTags() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1.setArtist("Artist 1");

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2.setArtist("Artist 2");

        List<Integer> monumentIds = monumentService.insert(Arrays.asList(monument1, monument2));
        monument1.setId(monumentIds.get(0));
        monument2.setId(monumentIds.get(1));

        Tag tag1 = new Tag();
        tag1.setMonuments(Arrays.asList(monument1));
        tag1.setName("tag1");

        Tag tag2 = new Tag();
        tag2.setMonuments(Arrays.asList(monument1, monument2));
        tag2.setName("tag2");

        tagService.insert(Arrays.asList(tag1, tag2));

        return monumentIds;
    }
}
