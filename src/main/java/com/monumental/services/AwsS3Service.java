package com.monumental.services;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.AmazonS3URI;
import org.springframework.stereotype.Service;
import java.io.File;
import java.util.regex.Matcher;
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

    // Constant for the folder where temporary Monument images are stored
    public static final String tempFolderName = "temp/";

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
            objectKey = objectKey.replaceAll(" ", "+");
            return new AmazonS3URI(httpsProtocol + bucketName + s3Domain + objectKey, false).toString();
        } catch (Exception e) {
            e.printStackTrace();
            return httpsProtocol + bucketName + s3Domain + objectKey;
        }
    }

    /**
     * Get the S3 Object Key given an S3 Object URL
     * @param objectUrl - The S3 Object URL to use to get the S3 Object Key
     * @param isTemporaryFolder - True to generate the Object Key using the temporary image folder, False otherwise
     * @return String - S3 Object Key created using the specified S3 Object URL
     */
    public static String getObjectKey(String objectUrl, boolean isTemporaryFolder) {
        if (objectUrl == null) {
            return null;
        }

        String[] objectUrlArray = objectUrl.split("/");
        String folderName = isTemporaryFolder ? tempFolderName : imageFolderName;
        return folderName + objectUrlArray[objectUrlArray.length - 1];
    }

    /**
     * Move an S3 Object with the specified originalObjectKey to a new location defined by the newObjectKey
     * The AWS S3 SDK does not have a move Object operation by default, so it's done by first copying the original
     * Object into the new location and then deleting the original Object
     * @param originalObjectKey - S3 Object Key for the Object to move
     * @param newObjectKey - S3 Object Key for where to move the Object to
     * @return String - The new S3 Object Key for where the Object was moved to. Will be null if the operation is
     * unsuccessful
     */
    public String moveObject(String originalObjectKey, String newObjectKey) {
        newObjectKey = generateUniqueKey(newObjectKey);

        try {
            // First, copy the original Object into the new location
            s3Client.copyObject(bucketName, originalObjectKey, bucketName, newObjectKey);
            // Then, delete the original Object
            s3Client.deleteObject(bucketName, originalObjectKey);

            return newObjectKey;
        } catch (AmazonServiceException e) {
            System.out.println("Error attempting to move Object: " + originalObjectKey + " to: " + newObjectKey);
            System.out.println(e.getErrorMessage());
            return null;
        }
    }

    /**
     * Delete an S3 Object with the specified Object Key
     * @param objectKey - S3 Object Key to delete
     */
    public void deleteObject(String objectKey) {
        try {
            s3Client.deleteObject(bucketName, objectKey);
        } catch (AmazonServiceException e) {
            System.out.println("Error attempting to delete Object: " + objectKey);
            System.out.println(e.getErrorMessage());
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

    @SuppressWarnings("ResultOfMethodCallIgnored")
    public static String generateUniqueKey(String objectKey) {

        int number = 0;

        while (!isUniqueKey(objectKey)) {
            String checkRegex = ".*\\([0-9]+\\).*";
            String captureRegex = "\\(([0-9]+)\\)";
            // If the key already ends with "(1)", for example
            if (objectKey.matches(checkRegex)) {
                Matcher matcher = Pattern.compile(captureRegex).matcher(objectKey);
                matcher.find();
                // The first group will be "(1)", the second group will be "1". Java's regex matching is stupid.
                number = Integer.parseInt(matcher.group(1));
                number++;
                objectKey = objectKey.replaceAll(captureRegex, "(" + number + ")");
            } else {
                String[] splitKey = objectKey.split("\\.");
                objectKey = splitKey[0] +  "(1)";
                for (int i = 1; i < splitKey.length; i++) {
                    objectKey += "." + splitKey[i];
                }
            }
        }

        return objectKey.replaceAll(" ", "+");
    }
}
