package util.csvparsing;

import com.monumental.models.Monument;

import java.util.Calendar;
import java.util.GregorianCalendar;

/**
 * Class used to convert a CSV row representing a Monument into a Monument object
 */
public class CsvMonumentConverter {
    /**
     * Static method for converting a CSV row representing a Monument into a Monument object
     * @param csvRow - CSV row representing a Monument, as a String
     * @return Monument - the Monument object represented by csvRow
     */
    public static Monument convertCsvRowToMonument(String csvRow) {
        // Regex to split on commas only if the comma has zero or an even number of quotes ahead of it
        // See: https://stackoverflow.com/questions/1757065/java-splitting-a-comma-separated-string-but-ignoring-commas-in-quotes
        String[] csvRowArray = csvRow.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
        Monument result = new Monument();

        for (int columnIndex = 0; columnIndex < csvRowArray.length; columnIndex++) {
            // Grab the value at the current column and remove any quotes that may be left
            String value = csvRowArray[columnIndex].replace("\"", "");

            // NOTE: The order of the columns is specific to the initial dataset
            // This may need to change based on the file format we decide to accept
            // I also assumed that if any columns were empty, they would be null
            switch (columnIndex) {
                case 0: // Submitted By
                    result.setSubmittedBy(value);
                    break;
                case 1: // Artist
                    result.setArtist(value);
                    break;
                case 2: // Title
                    result.setTitle(value);
                    break;
                case 3: // Date
                    // I made a couple of assumptions about the format of the dates in the file:
                    // 1. The dates would be in the format dd-mm-yyyy
                    // 2. If the day and month were unknown, the cell would just contain yyyy
                    // 3. In the case described in 2, the day and month would be set to 01-01
                    // TODO: Agree upon a standard format for dates in CSV file uploads
                    if (!value.isEmpty()) {
                        String[] dateArray = value.split("-");
                        GregorianCalendar calendar = new GregorianCalendar();

                        // Parsing format "yyyy"
                        if (dateArray.length == 1) {
                            int year = Integer.parseInt(dateArray[0]);
                            calendar.set(year, Calendar.JANUARY, 1);
                            result.setDate(calendar.getTime());
                        }
                        // Parsing format "dd-mm-yyyy"
                        else if (dateArray.length == 3) {
                            int day = Integer.parseInt(dateArray[0]);
                            int month = Integer.parseInt(dateArray[1]);
                            int year = Integer.parseInt(dateArray[2]);
                            // Remember that months are 0-based
                            calendar.set(year, month - 1, day);
                            result.setDate(calendar.getTime());
                        }
                    }

                    break;
                case 6: // Material
                    result.setMaterial(value);
                    break;
                case 9: // Latitude
                    if (!value.isEmpty()) {
                        result.setLat(Double.parseDouble(value));
                    }
                    break;
                case 10: // Longitude
                    if (!value.isEmpty()) {
                        result.setLon(Double.parseDouble(value));
                    }
                    break;
                case 11: // City
                    result.setCity(value);
                    break;
                case 12: // State
                    result.setState(value);
                    break;
            }
        }

        return result;
    }
}
