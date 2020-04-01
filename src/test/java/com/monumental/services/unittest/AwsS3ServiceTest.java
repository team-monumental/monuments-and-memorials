package com.monumental.services.unittest;

import com.monumental.services.AwsS3Service;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

/**
 * Test class for unit testing AwsS3Service
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class AwsS3ServiceTest {

    /** getObjectURL Tests **/

    @Test
    public void testAwsS3Service_getObjectUrl_NoFolderInObjectKey() {
        String objectKey = "object";

        String result = AwsS3Service.getObjectUrl(objectKey);

        assertEquals("https://" + AwsS3Service.bucketName + ".s3.us-east-2.amazonaws.com/object", result);
    }

    @Test
    public void testAwsS3Service_getObjectUrl_FolderInObjectKey() {
        String objectKey = "folder/object";

        String result = AwsS3Service.getObjectUrl(objectKey);
        try {
            assertEquals("https://" + AwsS3Service.bucketName + ".s3.us-east-2.amazonaws.com/" + URLEncoder.encode(
                    objectKey,
                    StandardCharsets.UTF_8.toString()
            ), result);
        } catch (UnsupportedEncodingException e) {
            fail(e.getMessage());
        }
    }
}
