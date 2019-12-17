package com.monumental.util.csvparsing.unittests;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static com.monumental.util.csvparsing.ImageFileHelper.isSupportedImageFile;
import static org.junit.Assert.*;

/**
 * Test class for unit testing ImageFileHelper
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class ImageFileHelperUnitTests {

    /** isSupportedImageFile Tests **/

    @Test
    public void testImageFileHelper_isSupportedImageFile_JPGFilePassed() {
        assertTrue(isSupportedImageFile("test.jpg"));
    }

    @Test
    public void testImageFileHelper_isSupportedImageFile_PNGFilePassed() {
        assertTrue(isSupportedImageFile("test.png"));
    }

    @Test
    public void testImageFileHelper_isSupportedImageFile_NonSupportedImageFilePassed() {
        assertFalse(isSupportedImageFile("test.txt"));
    }

    @Test
    public void testImageFileHelper_isSupportedImageFile_JPGFilePathPassed() {
        assertTrue(isSupportedImageFile("test/test/test.jpg"));
    }

    @Test
    public void testImageFileHelper_isSupportedImageFile_PNGFilePathPassed() {
        assertTrue(isSupportedImageFile("test/test/test/test.png"));
    }

    @Test
    public void testImageFileHelper_isSupportedImageFile_NonSupportedImageFilePathPassed() {
        assertFalse(isSupportedImageFile("test/yo/test.txt"));
    }
}
