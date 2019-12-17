package com.monumental.util.csvparsing;

/**
 * Class that defines helper methods for interfacing with image files
 */
public class ImageFileHelper {

    /**
     * Determine if the specified filePath points to an accepted image file
     * Accepted image file formats are JPG and PNG
     * @param filePath - The path to the file to check as a String
     * @return boolean - True if the file extension of filePath is of an accepted image file type, False otherwise
     */
    public static boolean isSupportedImageFile(String filePath) {
        String[] fileExtensionArray = filePath.split("\\.");
        String fileExtension = fileExtensionArray[fileExtensionArray.length - 1];

        return fileExtension.equals("jpg") || fileExtension.equals("png");
    }
}
