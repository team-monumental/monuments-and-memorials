package com.monumental.util.string;

/**
 * Class that provides helper methods for String processing
 */
public class StringHelper {

    // Constant for the HTTPS protocol portion of a URL
    private static final String httpsProtocol = "https://";

    // Constant for the AWS S3 Domain for the storage Bucket
    private static final String s3Domain = ".s3.us-east-2.amazonaws.com/";

    /**
     * Method to determine if a specified String is null or empty
     * @param string - String to check for null or empty
     * @return boolean - True if the String is null or empty, false otherwise
     */
    public static boolean isNullOrEmpty(String string) {
        if (string == null) {
            return true;
        }
        return string.isEmpty();
    }

    /**
     * Method to build the Object URL for a specified bucketName and objectKey
     * @param bucketName - The name of the Bucket for the Object URL
     * @param objectKey - The Object key for the Object
     * @return String - The Object URL for the Object
     */
    public static String buildAwsS3ObjectUrl(String bucketName, String objectKey) {
        return httpsProtocol + bucketName + s3Domain + objectKey;
    }
}
