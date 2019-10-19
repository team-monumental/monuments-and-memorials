package util.csvparsing;

/**
 * Class that defines common methods needed to interface with CSV Files
 */
class CsvFileInterface {

    /**
     * Method to determine if the filePath points to a CSV file
     * @param filePath - the path to the file to check, as a String
     * @return boolean - true if the file extension of filePath is ".csv", false otherwise
     */
    static boolean isCsvFile(String filePath) {
        String[] fileExtensionArray = filePath.split("\\.");
        String fileExtension = fileExtensionArray[fileExtensionArray.length - 1];

        return fileExtension.equals("csv");
    }
}
