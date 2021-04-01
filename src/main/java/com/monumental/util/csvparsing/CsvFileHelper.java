package com.monumental.util.csvparsing;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Class that defines common methods needed when interfacing with CSV files
 */
public class CsvFileHelper {

    /**
     * Constant for the regex to split on commas only if the comma has zero or an even number of quotes ahead of it
     * See: https://stackoverflow.com/questions/1757065/java-splitting-a-comma-separated-string-but-ignoring-commas-in-quotes
     */
    private static final String csvRegex = ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)";

    /**
     * Static method to determine if the filePath points to a CSV file
     * @param filePath - the path to the file to check, as a String
     * @return boolean - true if the file extension of filePath is ".csv", false otherwise
     */
    public static boolean isCsvFile(String filePath) {
        String[] fileExtensionArray = filePath.split("\\.");
        String fileExtension = fileExtensionArray[fileExtensionArray.length - 1];

        return fileExtension.equals("csv");
    }

    public static Map<Integer, String> getFieldPositions(String[] headers, Map<String, String> mapping) {
        Map<Integer, String> map = new HashMap<>();
        for (int i = 0; i < headers.length; i++) {
            if (mapping.get(headers[i]) == null) {
                map.put(i, headers[i].toLowerCase());
            } else {
                map.put(i, mapping.get(headers[i]));
            }
        }
        return map;
    }
}
