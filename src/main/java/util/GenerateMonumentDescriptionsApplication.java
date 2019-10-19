package util;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import com.monumental.services.SessionFactoryService;

import java.util.List;

/**
 * Class used to get/generate the descriptions for all of the Monuments currently in the database
 * First, grabs all of the Monuments currently in the database
 * Then, for each Monument, calls CsvMonumentConverter.
 */
public class GenerateMonumentDescriptionsApplication {
    public static void main(String[] args) {
        SessionFactoryService sessionFactoryService = new SessionFactoryService();
        MonumentService monumentService = new MonumentService(sessionFactoryService);

        // Passing in true so that the References are loaded as-well
        List<Monument> allMonuments = monumentService.getAll(true);
    }
}
