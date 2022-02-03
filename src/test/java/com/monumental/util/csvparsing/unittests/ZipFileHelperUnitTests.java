package com.monumental.util.csvparsing.unittests;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static com.monumental.util.csvparsing.ZipFileHelper.isZipFile;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 * Test class for unit testing ZipFileHelper
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class ZipFileHelperUnitTests {

    /**
     * isZipFile Tests
     **/

    @Test
    public void testZipFileHelper_isZipFile_ZipFilePassed() {
        assertTrue(isZipFile("test.zip"));
    }

    @Test
    public void testZipFileHelper_isZipFile_NonZipFilePassed() {
        assertFalse(isZipFile("test.txt"));
    }

    @Test
    public void testZipFileHelper_isZipFile_ZipFilePathPassed() {
        assertTrue(isZipFile("test/test/test/test.zip"));
    }

    @Test
    public void testZipFileHelper_isZipFile_NonZipFilePathPassed() {
        assertFalse(isZipFile("yo/test/yo/test.txt"));
    }
}
