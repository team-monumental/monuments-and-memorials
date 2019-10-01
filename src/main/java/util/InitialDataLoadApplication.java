package util;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import com.monumental.services.SessionFactoryService;
import util.csvparsing.CsvFileReader;
import util.csvparsing.CsvMonumentConverter;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Class used to load the initial dataset into the database
 * Creates a CsvFileReader class and uses it to iterate all of the rows in the CSV
 * Turns each row into a Monument object, accumulates them and inserts them into the database
 */
public class InitialDataLoadApplication {
    public static void main(String[] args) {
        String pathToDatasetCsv = "C:\\Users\\nickb\\Documents\\Initial Dataset.csv";
        String csvRow;
        int rowCount = 0;
        ArrayList<Monument> newMonuments = new ArrayList<>();
        SessionFactoryService sessionFactoryService = new SessionFactoryService();
        MonumentService monumentService = new MonumentService(sessionFactoryService);

        try {
            // Create our CsvFileReader, passing it the path to the dataset file
            CsvFileReader csvFileReader = new CsvFileReader(pathToDatasetCsv);
            // Read the rows in the file until there are no more to read
            while ((csvRow = csvFileReader.readNextRow()) != null) {
                // Increment the rowCount
                rowCount++;
                System.out.println("Processing row number: " + rowCount);

                try {
                    // Convert the row into a Monument objects
                    Monument newMonument = CsvMonumentConverter.convertCsvRowToMonument(csvRow.strip());
                    // Add the newMonument to the accumulating list
                    newMonuments.add(newMonument);
                }
                catch (Exception e) {
                    System.out.println("Failed to process row number: " + rowCount);
                    System.out.println("Exception: " + e.toString());
                }
            }

            System.out.println("Number of new Monuments created: " + newMonuments.size());

            // Insert all accumulated monuments into the database
            List<Integer> monumentIdsInserted = monumentService.insert(newMonuments);

            System.out.println("Number of Monuments inserted into the database: " + monumentIdsInserted.size());
        }
        catch (FileNotFoundException e) {
            System.out.println("Unable to read from the specified filepath. File does not exist.");
        }
        catch (IOException e) {
            System.out.println("Error occurred while reading from the specified file.");
        }
    }
}
