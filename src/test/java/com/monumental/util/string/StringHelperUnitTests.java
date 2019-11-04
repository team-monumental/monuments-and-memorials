package com.monumental.util.string;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 * Test class for unit testing StringHelper
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class StringHelperUnitTests {

    /** isNullOrEmpty Tests **/

    @Test
    public void testStringHelper_isNullOrEmpty_NullString() {
        String string = null;

        assertTrue(StringHelper.isNullOrEmpty(string));
    }

    @Test
    public void testStringHelper_isNullOrEmpty_EmptyString() {
        String string = "";

        assertTrue(StringHelper.isNullOrEmpty(string));
    }

    @Test public void testStringHelper_isNullOrEmpty_NotNullOrEmptyString() {
        String string = "string";

        assertFalse(StringHelper.isNullOrEmpty(string));
    }
}
