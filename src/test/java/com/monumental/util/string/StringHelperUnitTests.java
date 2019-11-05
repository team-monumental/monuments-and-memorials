package com.monumental.util.string;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

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

    /** buildAwsS3ObjectUrl Tests **/
    @Test
    public void testStringHelper_buildAwsS3ObjectUrl_NoFolderInObjectKey() {
        String bucketName = "bucket";
        String objectKey = "object";

        String result = StringHelper.buildAwsS3ObjectUrl(bucketName, objectKey);

        assertEquals("https://bucket.s3.us-east-2.amazonaws.com/object", result);
    }

    @Test
    public void testStringHelper_buildAwsS3ObjectUrl_FolderInObjectKey() {
        String bucketName = "bucket";
        String objectKey = "folder/object";

        String result = StringHelper.buildAwsS3ObjectUrl(bucketName, objectKey);

        assertEquals("https://bucket.s3.us-east-2.amazonaws.com/folder/object", result);
    }
}
