package util.csvparsing;

import com.monumental.models.Contribution;
import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.models.Tag;

import java.util.Calendar;
import java.util.GregorianCalendar;

/**
 * Class used to convert a CSV row representing a Monument into a Monument object
 */
public class CsvMonumentConverter {
    /**
     * Static method for converting a CSV row representing a Monument into a Monument object
     * @param csvRow - CSV row representing a Monument, as a String
     * @return Monument - the Monument that is represented by the CSV row
     */
    public static Monument convertCsvRowToMonument(String csvRow) {
        // Regex to split on commas only if the comma has zero or an even number of quotes ahead of it
        // See: https://stackoverflow.com/questions/1757065/java-splitting-a-comma-separated-string-but-ignoring-commas-in-quotes
        String[] csvRowArray = csvRow.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
        GregorianCalendar calendar = new GregorianCalendar();

        Monument monument = new Monument();

        for (int columnIndex = 0; columnIndex < csvRowArray.length; columnIndex++) {
            // Grab the value at the current column and replace the beginning and ending quotes if applicable
            String value = removeBeginningAndEndingQuotes(csvRowArray[columnIndex]);

            // NOTE: The order of the columns is specific to the initial dataset
            // This may need to change based on the file format we decide to accept
            // I also assumed that if any columns were empty, they would be null
            switch (columnIndex) {
                case 0: // Submitted By
                    Contribution newContribution = new Contribution();
                    newContribution.setDate(calendar.getTime());
                    newContribution.setSubmittedBy(value);
                    newContribution.setMonument(monument);

                    monument.addContribution(newContribution);
                    break;
                case 1: // Artist
                    monument.setArtist(value);
                    break;
                case 2: // Title
                    monument.setTitle(value);
                    break;
                case 3: // Date
                    // I made a couple of assumptions about the format of the dates in the file:
                    // 1. The dates would be in the format dd-mm-yyyy
                    // 2. If the day and month were unknown, the cell would just contain yyyy
                    // 3. In the case described in 2, the day and month would be set to 01-01
                    // TODO: Agree upon a standard format for dates in CSV file uploads
                    if (!value.isEmpty()) {
                        String[] dateArray = value.split("-");

                        // Parsing format "yyyy"
                        if (dateArray.length == 1) {
                            int year = Integer.parseInt(dateArray[0]);
                            calendar.set(year, Calendar.JANUARY, 1);
                            monument.setDate(calendar.getTime());
                        }
                        // Parsing format "dd-mm-yyyy"
                        else if (dateArray.length == 3) {
                            int day = Integer.parseInt(dateArray[0]);
                            int month = Integer.parseInt(dateArray[1]);
                            int year = Integer.parseInt(dateArray[2]);
                            // Remember that months are 0-based
                            calendar.set(year, month - 1, day);
                            monument.setDate(calendar.getTime());
                        }
                    }

                    break;
                case 6: // Material
                    monument.setMaterial(value);
                    break;
                case 7: // Inscription
                    monument.setInscription(value);
                    break;
                case 9: // Latitude
                    if (!value.isEmpty()) {
                        monument.setLat(Double.parseDouble(value));
                    }
                    break;
                case 10: // Longitude
                    if (!value.isEmpty()) {
                        monument.setLon(Double.parseDouble(value));
                    }
                    break;
                case 11: // City
                    monument.setCity(value);
                    break;
                case 12: // State
                    monument.setState(value);
                    break;
                case 13: // Tag columns
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 20:
                    if (!value.isEmpty()) {
                        // Split on commas in-case there are more than one Tag in the column
                        String[] tagArray = value.split(",");

                        for (int tagArrayColumnIndex = 0; tagArrayColumnIndex < tagArray.length; tagArrayColumnIndex++) {
                            Tag newTag = new Tag();

                            // Set the first letter of the Tag to upper-case to attempt to reduce duplicates
                            value = value.substring(0, 1).toUpperCase() + value.substring(1);
                            value = value.strip();
                            newTag.setName(value);

                            monument.addTag(newTag);
                        }
                    }

                    break;
                case 22: // Reference
                    Reference newReference = new Reference();
                    newReference.setUrl(value);
                    newReference.setMonument(monument);

                    monument.addReference(newReference);
            }
        }

        return monument;
    }

    /**
     * Static method to remove beginning and ending quotes from a specified string
     * Does nothing if there are not both beginning and ending quotes
     * @param string - the String to remove the quotes from
     * @return String - the updated String, with removed quotes if applicable
     */
    private static String removeBeginningAndEndingQuotes(String string) {
        // If the string begins and ends with quotes, remove them
        if (string.startsWith("\"") && string.endsWith("\"")) {
            string = string.substring(1, (string.length() - 1));
        }

        return string;
    }
}
