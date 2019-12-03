package com.monumental.util.string;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Class that provides helper methods for String processing
 */
public class StringHelper {

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

    /**
     * Parse a String into a Date object or null
     */
    public static Date parseNullableDate(String value) {
        if (isNullOrEmpty(value)) return null;
        else {
            try {
                return new SimpleDateFormat("YYYY-MM-DD").parse(value);
            } catch (ParseException e) {
                return null;
            }
        }
    }
}
