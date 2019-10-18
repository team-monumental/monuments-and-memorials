package util;

import com.monumental.models.Monument;
import com.monumental.services.*;
import util.csvparsing.CsvFileReader;
import util.csvparsing.CsvMonumentConverter;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Class used to load the initial dataset into the database
 * Creates a CsvFileReader class and uses it to iterate all of the rows in the CSV
 * Turns each row into a MonumentEntity object and accumulates them
 * Then does validation on each MonumentEntity object before converting it into a Monument object and inserting it
 * into the database
 */
public class InitialDataLoadApplication {
    public static void main(String[] args) {
        String pathToDatasetCsv = "C:\\Users\\nickb\\Documents\\Initial Dataset.csv";
        String csvRow;
        int rowCount = 0;
        ArrayList<Monument> monuments = new ArrayList<>();

        SessionFactoryService sessionFactoryService = new SessionFactoryService();
        MonumentService monumentService = new MonumentService(sessionFactoryService);
        TagService tagService = new TagService(sessionFactoryService);

        try {
            // Create our CsvFileReader, passing it the path to the dataset file
            CsvFileReader csvFileReader = new CsvFileReader(pathToDatasetCsv);
            // Read the rows in the file until there are no more to read
            while ((csvRow = csvFileReader.readNextRow()) != null) {
                // Increment the rowCount
                rowCount++;
                System.out.println("Processing row number: " + rowCount);

                try {
                    // Convert the row into a Monument object
                    Monument monument = CsvMonumentConverter.convertCsvRowToMonument(csvRow.strip());
                    // Validate the new Monument object
                    List<String> violationMessages = monument.validate();
                    // If there were no violations, add the Monument to the accumulating list
                    if (violationMessages == null) {
                        monuments.add(monument);
                    }
                    else {
                        System.out.println("Failed to validate Monument: " + monument.toString());
                        System.out.println("Reasons: ");
                        for (String violationMessage : violationMessages) {
                            System.out.println("\t" + violationMessage);
                        }
                    }
                }
                catch (Exception e) {
                    System.out.println("Failed to process row number: " + rowCount);
                    System.out.println("Exception: " + e.toString());
                }
            }

            System.out.println("Number of Monuments created: " + monuments.size());

            int monumentInsertedCount = 0;

            for (Monument m : monuments) {

                //monumentService.addTagsToMonument(m, m.getTags());

                monumentService.insert(m);

                monumentInsertedCount++;
            }

            System.out.println("Number of Monuments inserted into the database: " + monumentInsertedCount);
        }
        catch (FileNotFoundException e) {
            System.out.println("Unable to read from the specified filepath. File does not exist.");
        }
        catch (IOException e) {
            System.out.println("Error occurred while reading from the specified file.");
        }
    }
}
