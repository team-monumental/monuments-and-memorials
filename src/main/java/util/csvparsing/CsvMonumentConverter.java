package util.csvparsing;

import com.monumental.models.Contribution;
import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.models.Tag;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

/**
 * Class used to:
 * 1. Convert a CSV row representing a Monument into a CsvMonumentConverterResult object
 * 2. Convert a Monument into a CSV row
 */
public class CsvMonumentConverter {
    /**
     * Static method for converting a CSV row representing a Monument into a CsvMonumentConverterResult object
     * @param csvRow - CSV row representing a Monument, as a String
     * @return CsvMonumentConverterResult - the CsvMonumentConverterResult that is represented by the CSV row
     */
    public static CsvMonumentConverterResult convertCsvRow(String csvRow) {
        // Regex to split on commas only if the comma has zero or an even number of quotes ahead of it
        // See: https://stackoverflow.com/questions/1757065/java-splitting-a-comma-separated-string-but-ignoring-commas-in-quotes
        String[] csvRowArray = csvRow.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
        GregorianCalendar calendar = new GregorianCalendar();

        Monument monument = new Monument();
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();

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

                    monument.getContributions().add(newContribution);
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

                            String tagValue = tagArray[tagArrayColumnIndex];
                            // Set the first letter of the Tag to upper-case to attempt to reduce duplicates
                            tagValue = tagValue.strip();
                            tagValue = tagValue.substring(0, 1).toUpperCase() + tagValue.substring(1);
                            newTag.setName(tagValue);
                            newTag.addMonument(monument);

                            result.addTag(newTag);
                        }
                    }

                    break;
                case 22: // Reference
                    Reference newReference = new Reference();
                    newReference.setUrl(value);
                    newReference.setMonument(monument);

                    monument.getReferences().add(newReference);
            }
        }

        result.setMonument(monument);

        return result;
    }

    /**
     * Static method for converting a specified Monument into a CSV row
     * @param monument - Monument to convert into a CSV row
     * @return String - CSV row representing the specified Monument
     */
    public static String convertMonument(Monument monument) {
        String csvRow = "";

        // Column 1: ID
        if (monument.getId() != null) {
            csvRow += monument.getId();
        }

        csvRow += ",";

        // Column 2: Title
        String title = monument.getTitle();
        if (title != null && !title.isEmpty()) {
            title = title.replace("\"", "");
            if (title.contains(",")) {
                csvRow += addBeginningAndEndingQuotes(title);
            }
            else {
                csvRow += title;
            }
        }

        csvRow += ",";

        // Column 3: Artist
        String artist = monument.getArtist();
        if (artist != null && !artist.isEmpty()) {
            artist = artist.replace("\"", "");
            if (artist.contains(",")) {
                csvRow += addBeginningAndEndingQuotes(artist);
            }
            else {
                csvRow += artist;
            }
        }

        csvRow += ",";

        // Column 4: Date
        // Format: "dd-mm-yyyy"
        if (monument.getDate() != null) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-mm-yyyy");
            csvRow += simpleDateFormat.format(monument.getDate());
        }

        csvRow += ",";

        // Column 5: Material
        String material = monument.getMaterial();
        if (material != null && !material.isEmpty()) {
            material = material.replace("\"", "");
            if (material.contains(",")) {
                csvRow += addBeginningAndEndingQuotes(material);
            }
            else {
                csvRow += material;
            }
        }

        csvRow += ",";

        // Column 6: Latitude
        if (monument.getLat() != null) {
            csvRow += monument.getLat();
        }

        csvRow += ",";

        // Column 7: Longitude
        if (monument.getLon() != null) {
            csvRow += monument.getLon();
        }

        csvRow += ",";

        // Column 8: City
        String city = monument.getCity();
        if (city != null && !city.isEmpty()) {
            city = city.replace("\"", "");
            if (city.contains(",")) {
                csvRow += addBeginningAndEndingQuotes(city);
            }
            else {
                csvRow += city;
            }
        }

        csvRow += ",";

        // Column 9: State
        String state = monument.getState();
        if (state != null && !state.isEmpty()) {
            state = state.replace("\"", "");
            if (state.contains(",")) {
                csvRow += addBeginningAndEndingQuotes(state);
            }
            csvRow += state;
        }

        csvRow += ",";

        // Column 10: Address
        String address = monument.getAddress();
        if (address != null && !address.isEmpty()) {
            address = address.replace("\"", "");
            if (address.contains(",")) {
                csvRow += addBeginningAndEndingQuotes(address);
            }
            else {
                csvRow += address;
            }
        }

        csvRow += ",";

        // Column 11: Inscription
        String inscription = monument.getInscription();
        if (inscription != null && !inscription.isEmpty()) {
            inscription = inscription.replace("\"", "");
            if (inscription.contains(",")) {
                csvRow += addBeginningAndEndingQuotes(inscription);
            }
            else {
                csvRow += inscription;
            }
        }

        csvRow += ",";

        // Column 12: Description
        String description = monument.getDescription();
        if (description.contains(",")) {
            csvRow += addBeginningAndEndingQuotes(description);
        }
        else {
            csvRow += description;
        }

        csvRow += ",";

        // Column 13: Tags
        StringBuilder tagsColumn = new StringBuilder();

        List<Tag> tags = monument.getTags();
        boolean isLastTag;

        if (tags != null) {
            for (int i = 0; i < tags.size(); i++) {
                isLastTag = (i == (tags.size() - 1));
                tagsColumn.append(tags.get(i).getName());
                if (!isLastTag) {
                    tagsColumn.append(",");
                }
            }
        }

        csvRow += addBeginningAndEndingQuotes(tagsColumn.toString());

        csvRow += ",";

        // Column 14: Contributors
        StringBuilder contributorsColumn = new StringBuilder();

        List<Contribution> contributions = monument.getContributions();
        boolean isLastContribution;

        if (contributions != null) {
            for (int i = 0; i < contributions.size(); i++) {
                isLastContribution = (i == (contributions.size() - 1));
                contributorsColumn.append(contributions.get(i).getSubmittedBy());
                if (!isLastContribution) {
                    contributorsColumn.append(",");
                }
            }
        }

        csvRow += addBeginningAndEndingQuotes(contributorsColumn.toString());

        csvRow += ",";

        // Column 15: References
        StringBuilder referencesColumn = new StringBuilder();

        List<Reference> references = monument.getReferences();
        boolean isLastReference;

        if (references != null) {
            for (int i = 0; i < references.size(); i++) {
                isLastReference = (i == (references.size() - 1));
                referencesColumn.append(references.get(i).getUrl());
                if (!isLastReference) {
                    referencesColumn.append(",");
                }
            }
        }

        csvRow += addBeginningAndEndingQuotes(referencesColumn.toString());

        return csvRow;
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

    /**
     * Static method to add the beginning and ending quotes to a specified String
     * Does nothing if there are already beginning and ending quotes
     * @param string - the String to add the quotes to
     * @return String - the updated String, with beginning and ending quotes
     */
    private static String addBeginningAndEndingQuotes(String string) {
        if (string.startsWith("\"") && string.endsWith("\"")) {
            return string;
        }

        return "\"" + string + "\"";
    }

    /**
     * Static method to get the header row for CSV file outputs
     * @return String - the CSV header row
     */
    public static String getHeaderRow() {
        return "ID,Title,Artist,Date,Material,Latitude,Longitude,City,State,Address,Inscription,Description," +
                "Tags,Contributors,References";
    }
}
