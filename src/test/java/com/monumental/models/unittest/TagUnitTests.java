package com.monumental.models.unittest;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;

import static org.junit.Assert.assertEquals;

/**
 * Test class for unit testing Tag
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class TagUnitTests {

    /**
     * addMonument Tests
     **/
    @Test
    public void testTag_addMonument_NullMonuments_NullMonument() {
        Tag tag = new Tag();

        tag.addMonument(null);

        assertEquals(0, tag.getMonuments().size());
    }

    @Test
    public void testTag_addMonument_NullMonuments_MonumentAdded() {
        Tag tag = new Tag();

        Monument monument = new Monument();

        tag.addMonument(monument);

        assertEquals(1, tag.getMonuments().size());
    }

    @Test
    public void testTag_addMonument_NotNullMonuments_MultipleMonumentsAdded() {
        Tag tag = new Tag();
        tag.setMonuments(new ArrayList<>());

        Monument monument1 = new Monument();
        Monument monument2 = new Monument();
        Monument monument3 = new Monument();

        tag.addMonument(monument1);
        tag.addMonument(monument2);
        tag.addMonument(monument3);

        assertEquals(3, tag.getMonuments().size());
    }
}
