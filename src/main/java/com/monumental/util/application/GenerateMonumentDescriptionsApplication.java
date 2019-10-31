package com.monumental.util.application;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import com.monumental.services.SessionFactoryService;
import com.monumental.util.csvparsing.CsvFileWriter;
import com.monumental.util.csvparsing.CsvMonumentConverter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Class used to get/generate the descriptions for all of the Monuments currently in the database
 * NOTE: This can potentially load a lot of data. Be cautious when running this application.
 * First, grabs all of the Monuments currently in the database
 * Then, for each Monument, calls CsvMonumentConverter.convertMonument to get the CSV row representing the Monument
 * and adds them to an accumulating List
 * Passes all of the CSV rows to the CsvFileWriter to append to the CSV file
 * Finally, closes the CsvFileWriter
 */
public class GenerateMonumentDescriptionsApplication {
    public static void main(String[] args) {
        String pathToCsvFileOutput = "C:\\Users\\nickb\\Documents\\Initial Dataset Descriptions.csv";

        SessionFactoryService sessionFactoryService = new SessionFactoryService();
        MonumentService monumentService = new MonumentService(sessionFactoryService);

        ArrayList<String> csvRows = new ArrayList<>();

        // Passing in true so that the collections are loaded as-well
        List<Monument> allMonuments = monumentService.getAll(true);
        // Sort the Monuments in ascending order by ID
        allMonuments.sort(Comparator.comparing(Monument::getId));

        for (Monument monument : allMonuments) {
            csvRows.add(CsvMonumentConverter.convertMonument(monument));
        }

        CsvFileWriter csvFileWriter = new CsvFileWriter(pathToCsvFileOutput);

        try {
            csvFileWriter.initialize();
            csvFileWriter.writeRow(CsvMonumentConverter.getHeaderRow());
            csvFileWriter.writeRows(csvRows);
            System.out.println("Wrote " + csvRows.size() + " rows to the CSV file");
        } catch (IOException e) {
            System.out.println("Error occurred while writing to the specified file.");
        }
        finally {
            csvFileWriter.close();
        }
    }
}
