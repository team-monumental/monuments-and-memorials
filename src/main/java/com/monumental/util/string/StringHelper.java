package com.monumental.util.string;

/**
 * Class that provides helper methods for String processing
 */
public class StringHelper {

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
}
