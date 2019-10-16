package util;

import com.monumental.models.Monument;
import com.monumental.models.entitymodels.MonumentEntity;
import com.monumental.services.*;
import util.csvparsing.CsvFileReader;
import util.csvparsing.CsvMonumentConverter;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;

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
        ArrayList<MonumentEntity> newEntities = new ArrayList<>();

        SessionFactoryService sessionFactoryService = new SessionFactoryService();
        MonumentService monumentService = new MonumentService(sessionFactoryService);
        TagService tagService = new TagService(sessionFactoryService);
        ContributionService contributionService = new ContributionService(sessionFactoryService);
        ReferenceService referenceService = new ReferenceService(sessionFactoryService);

        try {
            // Create our CsvFileReader, passing it the path to the dataset file
            CsvFileReader csvFileReader = new CsvFileReader(pathToDatasetCsv);
            // Read the rows in the file until there are no more to read
            while ((csvRow = csvFileReader.readNextRow()) != null) {
                // Increment the rowCount
                rowCount++;
                System.out.println("Processing row number: " + rowCount);

                try {
                    // Convert the row into a MonumentEntity object
                    MonumentEntity newEntity = CsvMonumentConverter.convertCsvRowToMonumentEntity(csvRow.strip());
                    // Add the MonumentEntity to the accumulating list
                    newEntities.add(newEntity);
                }
                catch (Exception e) {
                    System.out.println("Failed to process row number: " + rowCount);
                    System.out.println("Exception: " + e.toString());
                }
            }

            System.out.println("Number of MonumentEntities created: " + newEntities.size());

            ArrayList<Monument> newMonuments = new ArrayList<>();

            for (MonumentEntity entity : newEntities) {
                // Convert each MonumentEntity into a Monument
                Monument newMonument = monumentService.convertMonumentEntityToMonument(entity);
                // convertMonumentEntityToMonument returns null if the specified MonumentEntity is invalid
                if (newMonument != null) {
                    newMonuments.add(newMonument);
                }
                else {
                    System.out.println("Invalid MonumentEntity found: " + entity.toString());
                }
            }

            System.out.println("Number of valid MonumentEntities: " + newMonuments.size());

            int monumentInsertedCount = 0;

            for (Monument monument : newMonuments) {
                // Insert each of the new Monuments into the database
                monumentService.insert(monument);

                // Insert or update each of the Tags associated with the new Monument into the database
                tagService.insertOrUpdateTags(monument.getTags(), monument);

                // Insert each Contribution associated with the new Monument into the database
                contributionService.insert(monument.getContributions());

                // Insert each Reference associated with the new Monument into the database
                referenceService.insert(monument.getReferences());

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
