package com.monumental.services;

import org.springframework.stereotype.Service;

/**
 * Class responsible for communicating with the AWS S3 service
 * Wraps around the AWS S3 Java SDK to perform its functions
 */

@Service
public class AwsS3Service {

    // Constant for the HTTPS protocol portion of a URL
    private static final String httpsProtocol = "https://";

    // Constant for the AWS S3 Domain for the storage Bucket
    private static final String s3Domain = ".s3.us-east-2.amazonaws.com/";

    public AwsS3Service() {

    }

    /**
     * Method to generate the Object URL for a specified bucketName and objectKey
     * @param bucketName - The name of the Bucket for the Object URL
     * @param objectKey - The Object Key for the Object
     * @return String - The Object URL for the Object
     */
    public static String getObjectUrl(String bucketName, String objectKey) {
        return httpsProtocol + bucketName + s3Domain + objectKey;
    }
}
