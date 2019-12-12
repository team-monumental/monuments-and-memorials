package com.monumental.util.application;

import com.monumental.services.MonumentService;
import com.monumental.util.csvparsing.BulkCreateResult;
import com.monumental.util.csvparsing.CsvFileReader;
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

/**
 * Class used to load the initial dataset into the database
 * Creates a CsvFileReader class and uses it to iterate all of the rows in the CSV
 * Turns each row into a CsvMonumentConverterResult object and accumulates them
 * Then does validation on each CsvMonumentConverterResult's Monument before inserting it into the database
 * Finally, closes the CsvFileReader
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

        String pathToDatasetCsv = "C:\\Users\\nickb\\Documents\\Initial Dataset.csv";

        MonumentService monumentService = context.getBean(MonumentService.class);

        // Create our CsvFileReader, passing it the path to the dataset file
        CsvFileReader csvFileReader = new CsvFileReader(pathToDatasetCsv);

        try {
            csvFileReader.initialize();

            // Read the entire CSV file contents
            List<String> csvContents = csvFileReader.readEntireFile();

            // Convert the contents of the CSV file into Monument objects and insert them into the database
            BulkCreateResult bulkCreateResult = monumentService.bulkCreateMonumentsFromCsv(csvContents);

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

        }
        catch (FileNotFoundException e) {
            System.out.println("Unable to read from the specified filepath. File does not exist.");
        }
        catch (IOException e) {
            System.out.println("Error occurred while reading from the specified file.");
        }
        finally {
            csvFileReader.close();
            System.exit(0);
        }
    }
}
