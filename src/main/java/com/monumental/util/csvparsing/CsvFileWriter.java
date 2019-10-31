package com.monumental.util.csvparsing;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

/**
 * Class used to write CSV files
 * This class has 2 responsibilities:
 * 1. Open/Create a CSV file given an absolute path to the file
 * 2. Write rows to the CSV file one at a time or all at once
 */
public class CsvFileWriter {

    private String filePath;

    private BufferedWriter writer;

    /**
     * Public constructor for CsvFileWriter
     * @param filePath - Path to the CSV file to write to
     */
    public CsvFileWriter(String filePath) {
        this.filePath = filePath;
    }

    /**
     * Initializes the CsvFileWrite for writing
     * Creates a new BufferedWriter to do the file writing
     * This method must be called for attempting to write CSV rows
     * @throws IOException - If the specified filePath can not be written to or created
     * @throws IllegalArgumentException - If the specified filePath is not a CSV file
     */
    public void initialize() throws IOException, IllegalArgumentException {
        if (this.filePath == null) {
            return;
        }

        if (CsvFileHelper.isCsvFile(this.filePath)) {
            File csvFile = new File(this.filePath);
            // Creates a new file if the file does not exist, otherwise does nothing
            csvFile.createNewFile();

            this.writer = new BufferedWriter(new FileWriter(csvFile));
        }
        else {
            throw new IllegalArgumentException("Invalid file path provided. File is not a CSV file.");
        }
    }

    /**
     * Method to write a row to the CSV file
     * Appends the row to the end of the file followed by a new line
     * @param row - String CSV row to write
     * @throws IOException - If the CsvFileWriter is unable to write to the file
     */
    public void writeRow(String row) throws IOException {
        if (this.writer == null) {
            return;
        }

        this.writer.append(row);
        this.writer.newLine();
    }

    /**
     * Method to write all of the rows to the CSV file
     * Appends the rows to the end of the file in the order they were passed in
     * @param rows - List<String> of CSV rows to write
     * @throws IOException - If the CsvFileWriter is unable to write to the file
     */
    public void writeRows(List<String> rows) throws IOException {
        if (this.writer == null) {
            return;
        }

        for (String row : rows) {
            this.writer.append(row);
            this.writer.newLine();
        }
    }

    /**
     * Closes the BufferedWriter and underlying Stream
     */
    public void close() {
        if (this.writer == null) {
            return;
        }

        try {
            this.writer.close();
        } catch (IOException e) {
            System.out.println("Unable to close CsvFileWriter.");
        }
    }
}
