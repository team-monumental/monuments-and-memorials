package com.monumental.util.csvparsing;

import java.io.*;

/**
 * Class used to read CSV files
 * This class has 2 responsibilities:
 * 1. Open a CSV file given an absolute path to the file
 * 2. Read rows from the CSV file until there are no more rows to read
 */
public class CsvFileReader {

    private String filePath;

    private BufferedReader reader;

    /**
     * Public constructor for CsvFileReader
     * @param filePath - path to the CSV file to read from
     */
    public CsvFileReader(String filePath) {
        this.filePath = filePath;
    }

    /**
     * Initializes a CsvFileReader for reading
     * Creates a new BufferedReader to do the file reading
     * This method must be called before attempting to read CSV rows
     * @throws FileNotFoundException - If the File pointed to by the specified filePath does not exist
     * @throws IllegalArgumentException - If the filePath specified does not point to a CSV file
     */
    public void initialize() throws FileNotFoundException, IllegalArgumentException {
        if (this.filePath == null) {
            return;
        }

        if (CsvFileHelper.isCsvFile(this.filePath)) {
            File csvFile = new File(this.filePath);
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
        if (this.reader == null) {
            return null;
        }

        return this.reader.readLine();
    }

    /**
     * Closes the BufferedReader and underlying Stream
     */
    public void close() {
        if (this.reader == null) {
            return;
        }

        try {
            this.reader.close();
        } catch (IOException e) {
            System.out.println("Unable to close CsvFileReader");
        }
    }
}
