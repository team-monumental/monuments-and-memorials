package util.csvparsing;

import java.io.*;

/**
 * Class used to interface with CSV files
 * This class has 2 responsibilities:
 * 1. Open a CSV file given an absolute path to the file
 * 2. Read rows from the CSV file until there are no more rows to read
 */
public class CsvFileReader {
    private BufferedReader reader;

    /**
     * Public constructor for CsvFileReader
     * Creates a BufferedReader object used to read from the specified file
     * @param filePath - path to the CSV file to read from
     * @throws IllegalArgumentException - If the filePath provided does not point to a CSV file
     * @throws FileNotFoundException - If the file pointed to by the filePath does not exist
     */
    public CsvFileReader(String filePath) throws IllegalArgumentException, FileNotFoundException {
        if (isCsvFile(filePath)) {
            File csvFile = new File(filePath);
            this.reader = new BufferedReader(new FileReader(csvFile));
        }
        else {
            throw new IllegalArgumentException("Invalid file path provided. File is not a CSV file.");
        }
    }

    /**
     * Method to read the next row in the CSV file
     * Will return null if it has read the last row in the file
     * @return - the next row in the CSV file as a String, null if it has read all of the rows
     * @throws IOException - if the CsvFileReader is unable to read from the specified file
     */
    public String readNextRow() throws IOException {
        return this.reader.readLine();
    }

    /**
     * Method to determine if the filePath points to a CSV file
     * @param filePath - the path to the file to check, as a String
     * @return boolean - true if the file extension of filePath is ".csv", false otherwise
     */
    private static boolean isCsvFile(String filePath) {
        String[] fileExtensionArray = filePath.split("\\.");
        String fileExtension = fileExtensionArray[fileExtensionArray.length - 1];

        return fileExtension.equals("csv");
    }
}
