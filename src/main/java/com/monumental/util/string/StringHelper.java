package com.monumental.util.string;

/**
 * Class that provides helper methods for String processing
 */
public class StringHelper {

    // Constant for the HTTPS protocol portion of a URL
    private static final String httpsProtocol = "https://";

    // Constant for the AWS S3 Domain for the storage Bucket
    private static final String s3Domain = ".s3.us-east-2.amazonaws.com/";

    // Constant for the regex for a valid latitude String
    // Taken from https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
    public static final String latitudeRegex = "^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$";

    // Constant for the regex for a valid longitude String
    // Taken from https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
    public static final String longitudeRegex = "^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$";

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

    /**
     * Method to remove beginning and ending quotes from a specified string
     * Does nothing if there are not both beginning and ending quotes
     * @param string - the String to remove the quotes from
     * @return String - the updated String, with removed quotes if applicable
     */
    public static String removeBeginningAndEndingQuotes(String string) {
        if (string == null) {
            return null;
        }

        // If the string begins and ends with quotes, remove them
        if (string.startsWith("\"") && string.endsWith("\"")) {
            string = string.substring(1, (string.length() - 1));
        }

        return string;
    }
}
