package com.monumental.services;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.stereotype.Service;

import java.io.File;

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

    // Constant for the Region the S3 Bucket is in
    private static final Regions bucketRegion = Regions.US_EAST_2;

    public AwsS3Service() {

    }

    /**
     * Method to store the specified File inside the Bucket with the specified bucketName with the specified
     * objectKey
     * Will not store the Object inside the Bucket if an Object already exists with the specified objectKey
     * Will still return a valid Object URL if the Object already exists with the specified objectKey
     * @param bucketName - The name of the Bucket to store the Object in
     * @param objectKey - The Object key used to store the Object under
     * @param file - The File to store in the Bucket
     * @return String - The full Object URL for the stored/already existing Object, Empty if unsuccessful
     */
    public String storeObject(String bucketName, String objectKey, File file) {
        String objectUrl = "";

        AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                        .withRegion(bucketRegion)
                        .build();

        try {
            if (!s3Client.doesObjectExist(bucketName, objectKey)) {
                s3Client.putObject(bucketName, objectKey, file);
            }

            objectUrl = getObjectUrl(bucketName, objectKey);
        } catch (AmazonServiceException e) {
            System.out.println("Error attempting to access S3 Bucket: " + bucketName + " and Object: " + objectKey);
            System.out.println(e.getErrorMessage());
        }

        return objectUrl;
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
