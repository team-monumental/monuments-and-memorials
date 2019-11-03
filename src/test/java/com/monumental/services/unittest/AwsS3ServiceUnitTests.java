package com.monumental.services.unittest;

import com.monumental.services.AwsS3Service;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;

@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class AwsS3ServiceUnitTests {

    @Test
    public void testAwsS3Service_getObjectUrl_NoFolderInObjectKey() {
        String bucketName = "bucket";
        String objectKey = "object";

        String result = AwsS3Service.getObjectUrl(bucketName, objectKey);

        assertEquals("https://bucket.s3.us-east-2.amazonaws.com/object", result);
    }

    @Test
    public void testAwsS3Service_getObjectUrl_FolderInObjectKey() {
        String bucketName = "bucket";
        String objectKey = "folder/object";

        String result = AwsS3Service.getObjectUrl(bucketName, objectKey);

        assertEquals("https://bucket.s3.us-east-2.amazonaws.com/folder/object", result);
    }
}
