package com.monumental.util.application;

import com.monumental.models.Monument;
import com.monumental.repositories.MonumentRepository;
import com.monumental.util.csvparsing.CsvFileWriter;
import com.monumental.util.csvparsing.CsvMonumentConverter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

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
@Configuration
@SpringBootApplication
@ComponentScan("com.monumental")
public class GenerateMonumentDescriptionsApplication {
    public static void main(String[] args) {

        SpringApplication app = new SpringApplication(GenerateMonumentDescriptionsApplication.class);
        // Don't start a web server - allows this application to run while the main Application is running
        app.setWebApplicationType(WebApplicationType.NONE);
        ConfigurableApplicationContext context = app.run(args);

        String pathToCsvFileOutput = "C:\\Users\\nickb\\Documents\\Initial Dataset Descriptions.csv";

        MonumentRepository monumentRepository = context.getBean(MonumentRepository.class);

        ArrayList<String> csvRows = new ArrayList<>();

        List<Monument> allMonuments = monumentRepository.findAll();
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
