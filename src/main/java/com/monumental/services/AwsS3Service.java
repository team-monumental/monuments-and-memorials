package com.monumental.services;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

/**
 * Class responsible for communicating with the AWS S3 service
 * Wraps around the AWS S3 Java SDK to perform its operations
 */
@Service
public class AwsS3Service {

    // Constant for the HTTPS protocol portion of a URL
    private static final String httpsProtocol = "https://";

    // Constant for the AWS S3 Domain for the storage Bucket
    private static final String s3Domain = ".s3.us-east-2.amazonaws.com/";

    // Constant for the Region the S3 Bucket is in
    private static final Regions bucketRegion = Regions.US_EAST_2;

    // Constant for the Bucket
    public static final String bucketName = "monuments-and-memorials";

    // Constant for the folder where Monument images are stored
    public static final String imageFolderName = "images/";

    private static AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
            .withRegion(bucketRegion)
            .build();

    /**
     * Store the specified file inside the Bucket with the specified bucketName with the specified
     * objectKey
     * Will not store the Object inside the Bucket if an Object already exists with the specified objectKey
     * Will still return a valid Object URL if the Object already exists with the specified objectKey
     * @param objectKey - The Object key used to store the Object under
     * @param file - The File to store in the Bucket
     * @return String - The full Object URL for the stored/already existing Object, Empty if unsuccessful
     */
    public String storeObject(String objectKey, File file) throws SdkClientException {
        objectKey = generateUniqueKey(objectKey);
        try {
            s3Client.putObject(bucketName, objectKey, file);
            return getObjectUrl(objectKey);
        } catch (SdkClientException e) {
            System.out.println("Error attempting to access S3 Bucket: " + bucketName + " and Object: " + objectKey);
            System.out.println(e.getMessage());
            throw e;
        }
    }

    /**
     * Method to generate the Object URL for a specified bucketName and objectKey
     * @param objectKey - The Object Key for the Object
     * @return String - The Object URL for the Object
     */
    public static String getObjectUrl(String objectKey) {
        try {
            return httpsProtocol + bucketName + s3Domain + URLEncoder.encode(
                    objectKey,
                    StandardCharsets.UTF_8.toString()
            );
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static boolean isUniqueKey(String objectKey) {
        try {
            return !s3Client.doesObjectExist(bucketName, objectKey);
        } catch (AmazonServiceException e) {
            System.out.println("Error attempting to access S3 Bucket: " + bucketName + " and Object: " + objectKey);
            System.out.println(e.getErrorMessage());
            return true;
        }
    }

    public static String generateUniqueKey(String objectKey) {
        if (isUniqueKey(objectKey)) return objectKey;
        else {
            String checkRegex = "/\\([0-9]*\\)/$";
            String captureRegex = "/\\(([0-9]*)\\)/$";
            // If the key already ends with "(1)", for example
            if (objectKey.contains(checkRegex)) {
                Integer number = Integer.parseInt(Pattern.compile(captureRegex).matcher(objectKey).group(0)) + 1;
                objectKey = objectKey.replaceAll(checkRegex, "(" + number + ")");
            } else {
                objectKey += " (1)";
            }
            return objectKey;
        }
    }
}
