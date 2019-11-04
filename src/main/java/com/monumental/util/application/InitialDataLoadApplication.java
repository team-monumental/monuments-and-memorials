package com.monumental.util.application;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.services.*;
import org.hibernate.exception.ConstraintViolationException;
import com.monumental.util.csvparsing.CsvFileReader;
import com.monumental.util.csvparsing.CsvMonumentConverter;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;

/**
 * Class used to load the initial dataset into the database
 * Creates a CsvFileReader class and uses it to iterate all of the rows in the CSV
 * Turns each row into a CsvMonumentConverterResult object and accumulates them
 * Then does validation on each CsvMonumentConverterResult's Monument before inserting it into the database
 * Finally, closes the CsvFileReader
 */
public class InitialDataLoadApplication {
    public static void main(String[] args) {
        String pathToDatasetCsv = "C:\\Users\\nickb\\Documents\\Initial Dataset.csv";
        String csvRow;
        int rowCount = 0;
        ArrayList<CsvMonumentConverterResult> results = new ArrayList<>();

        SessionFactoryService sessionFactoryService = new SessionFactoryService();
        MonumentService monumentService = new MonumentService(sessionFactoryService);
        TagService tagService = new TagService(sessionFactoryService);

        // Create our CsvFileReader, passing it the path to the dataset file
        CsvFileReader csvFileReader = new CsvFileReader(pathToDatasetCsv);

        try {
            csvFileReader.initialize();
            // Read the rows in the file until there are no more to read
            while ((csvRow = csvFileReader.readNextRow()) != null) {
                // Increment the rowCount
                rowCount++;
                System.out.println("Processing row number: " + rowCount);

                try {
                    // Convert the row into a CsvMonumentConverterResult object
                    CsvMonumentConverterResult result = CsvMonumentConverter.convertCsvRow(csvRow.strip());
                    // Validate the CsvMonumentConverterResult's Monument
                    Monument.ValidationResult validationResult = result.getMonument().validate(Monument.New.class);
                    // If the Monument is valid, add the CsvMonumentConverterResult to the accumulating list
                    if (validationResult.isValid()) {
                        results.add(result);
                    }
                    else {
                        System.out.println("Failed to validate Monument: " + result.getMonument().toString());
                        System.out.println("Reasons: ");
                        for (String violationMessage : validationResult.getViolationMessages()) {
                            System.out.println("\t" + violationMessage);
                        }
                    }
                }
                catch (Exception e) {
                    System.out.println("Failed to process row number: " + rowCount);
                    System.out.println("Exception: " + e.toString());
                }
            }

            System.out.println("Number of Monuments created: " + results.size());

            int monumentInsertedCount = 0;
            int tagInsertedCount = 0;

            for (CsvMonumentConverterResult r : results) {

                // Insert the Monument
                monumentService.insert(r.getMonument());
                monumentInsertedCount++;

                // Insert all of the Tags associated with the Monument
                // This isn't done by the above insert call because the Tag Model "owns" the monument_tag join table
                if (r.getTags() != null) {
                    for (Tag t : r.getTags()) {
                        try {
                            tagService.insert(t);
                            tagInsertedCount++;
                        } catch (ConstraintViolationException e) {
                            // If a ConstraintViolationException is caught, there's a duplicate Tag in the list we are trying
                            // to insert
                            // Instead, get the ID of the already existing Tag and update it
                            // Assume there is only 1 Tag with that Name due to the Unique Constraint
                            Integer tId = tagService.getTagsByName(t.getName(), false).get(0).getId();
                            t.setId(tId);
                            tagService.update(t);
                        }
                    }
                }
            }

            System.out.println("Number of Monuments inserted into the database: " + monumentInsertedCount);
            System.out.println("Number of Tags inserted into the database: " + tagInsertedCount);
        }
        catch (FileNotFoundException e) {
            System.out.println("Unable to read from the specified filepath. File does not exist.");
        }
        catch (IOException e) {
            System.out.println("Error occurred while reading from the specified file.");
        }
        finally {
            csvFileReader.close();
        }
    }
}
