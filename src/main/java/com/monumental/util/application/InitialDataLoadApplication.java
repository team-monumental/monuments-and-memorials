package com.monumental.util.application;

import com.monumental.services.MonumentService;
import com.monumental.util.csvparsing.BulkCreateResult;
import com.monumental.util.csvparsing.CsvFileHelper;
import com.monumental.util.csvparsing.CsvFileReader;
import com.monumental.util.csvparsing.ZipFileHelper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.zip.ZipFile;

/**
 * Class used to load the initial dataset into the database
 * If the dataset file is a CSV file, uses the CsvFileReader class to read the entire contents of the CSV file
 * and passes them to MonumentService for processing
 * If the dataset file is a .zip file, creates a ZipFile object and passes it to MonumentService for processing
 */
@Configuration
@SpringBootApplication
@ComponentScan("com.monumental")
public class InitialDataLoadApplication {

    public static void main(String[] args) {

        SpringApplication app = new SpringApplication(InitialDataLoadApplication.class);
        // Don't start a web server - allows this application to run while the main Application is running
        app.setWebApplicationType(WebApplicationType.NONE);
        ConfigurableApplicationContext context = app.run(args);

        String pathToDatasetFile = "C:\\Users\\nickb\\Documents\\Initial Dataset.csv";

        MonumentService monumentService = context.getBean(MonumentService.class);

        BulkCreateResult bulkCreateResult = new BulkCreateResult();

        try {
            if (CsvFileHelper.isCsvFile(pathToDatasetFile)) {
                // Create a CsvFileReader, passing it the path to the dataset file
                CsvFileReader csvFileReader = new CsvFileReader(pathToDatasetFile);

                // Initialize the CsvFileReader
                csvFileReader.initialize();

                // Read the entire CSV file contents
                List<String> csvContents = csvFileReader.readEntireFile();

                // Convert the contents of the CSV file into Monument objects and insert them into the database
                bulkCreateResult = monumentService.bulkCreateMonumentsFromCsv(csvContents, false, null, null);

                // Close the CsvFileReader
                csvFileReader.close();
            } else if (ZipFileHelper.isZipFile(pathToDatasetFile)) {
                // Create a ZipFile using the dataset file path
                ZipFile zipFile = new ZipFile(pathToDatasetFile);

                // Convert the ZipFile into Monument objects and insert them into the database
                bulkCreateResult = monumentService.bulkCreateMonumentsFromZip(zipFile);
            }
        } catch (FileNotFoundException e) {
            System.out.println("Unable to read from the specified filepath. File does not exist.");
            e.printStackTrace();
        } catch (IOException e) {
            System.out.println("Error occurred while reading from the specified file.");
            e.printStackTrace();
        }

        System.out.println("\nNumber of Monuments inserted into the database: " + bulkCreateResult.getMonumentsInsertedCount());

        System.out.println("Total Number of Invalid Monuments: " + bulkCreateResult.getInvalidCsvMonumentRecordsByRowNumber().size());

        List<Integer> invalidCsvMonumentRecordsByRowNumber = new ArrayList<>(bulkCreateResult.getInvalidCsvMonumentRecordsByRowNumber().keySet());
        Collections.sort(invalidCsvMonumentRecordsByRowNumber);

        for (Integer csvRowNumber : invalidCsvMonumentRecordsByRowNumber) {
            String invalidCsvRecordString = bulkCreateResult.getInvalidCsvMonumentRecordsByRowNumber()
                    .get(csvRowNumber);
            List<String> validationErrors = bulkCreateResult.getInvalidCsvMonumentRecordErrorsByRowNumber().
                    get(csvRowNumber);

            System.out.println("\n----- INVALID CSV RECORD ------");
            System.out.println("Invalid Row Number: " + csvRowNumber);
            System.out.println(invalidCsvRecordString);
            System.out.println("Validation Errors:");

            for (String validationError : validationErrors) {
                System.out.println(validationError);
            }
        }

        System.exit(0);
    }
}
