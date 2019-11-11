package com.monumental.util.application;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import com.monumental.services.*;
import com.monumental.util.csvparsing.CsvFileReader;
import com.monumental.util.csvparsing.CsvMonumentConverter;
import com.monumental.util.csvparsing.CsvMonumentConverterResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.dao.DataIntegrityViolationException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Class used to load the initial dataset into the database
 * Creates a CsvFileReader class and uses it to iterate all of the rows in the CSV
 * Turns each row into a CsvMonumentConverterResult object and accumulates them
 * Then does validation on each CsvMonumentConverterResult's Monument before inserting it into the database
 * Finally, closes the CsvFileReader
 */
@SpringBootApplication
@ComponentScan("com.monumental")
public class InitialDataLoadApplication {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(InitialDataLoadApplication.class, args);
        String pathToDatasetCsv = "C:\\Users\\Ben\\Downloads\\Initial.csv";
        String csvRow;
        int rowCount = 0;
        ArrayList<CsvMonumentConverterResult> results = new ArrayList<>();

        MonumentService monumentService = context.getBean(MonumentService.class);
        TagService tagService = context.getBean(TagService.class);

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
                List<Tag> tags = r.getTags();
                if (tags == null) tags = new ArrayList<>();

                List<Tag> materials = r.getMaterials();
                if (materials == null) materials = new ArrayList<>();

                tags.addAll(materials);

                if (tags.size() > 0) {
                    for (Tag tag : tags) {
                        try {
                            tagService.createTag(tag.getName(), tag.getMonuments());
                            tagInsertedCount++;
                        } catch (DataIntegrityViolationException e) {
                            // TODO: Determine how duplicate "monument_tag" (join table) records are being inserted
                            // These are disregarded for now - the correct tags are still being created
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
            System.exit(0);
        }
    }
}
