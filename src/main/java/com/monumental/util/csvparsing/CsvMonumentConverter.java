package com.monumental.util.csvparsing;

import com.monumental.models.*;
import com.monumental.util.string.StringHelper;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
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

        Double latitude = 0.0;
        Double longitude = 0.0;

        GeometryFactory geometryFactory = new GeometryFactory();

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
                    // 1. The dates would be in the format dd-MM-yyyy
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
                        latitude = Double.parseDouble(value);
                    }
                    break;
                case 10: // Longitude
                    if (!value.isEmpty()) {
                        longitude = Double.parseDouble(value);
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
                    break;
                case 25: // Image filename
                    if (!value.isEmpty()) {
                        value = formatJpgImageFileName(value);

                        Image newImage = new Image();
                        newImage.setUrl(StringHelper.buildAwsS3ObjectUrl("monument-images", "images/" + value));
                        newImage.setIsPrimary(true);
                        newImage.setMonument(monument);

                        monument.getImages().add(newImage);
                    }
                    break;
            }
        }

        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        // 4326 is the SRID for coordinates
        // Find more info here: https://spatialreference.org/ref/epsg/wgs-84/
        // And here: https://gis.stackexchange.com/questions/131363/choosing-srid-and-what-is-its-meaning
        point.setSRID(4326);
        monument.setCoordinates(point);

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
        csvRow += convertToCsvCell(monument.getId());

        csvRow += ",";

        // Column 2: Title
        csvRow += convertToCsvCell(monument.getTitle());

        csvRow += ",";

        // Column 3: Artist
        csvRow += convertToCsvCell(monument.getArtist());

        csvRow += ",";

        // Column 4: Date
        // Format: "dd-mm-yyyy"
        csvRow += convertToCsvCell(monument.getDate());

        csvRow += ",";

        // Column 5: Material
        csvRow += convertToCsvCell(monument.getMaterial());

        csvRow += ",";

        // Column 6: Latitude
        csvRow += convertToCsvCell(monument.getLat());

        csvRow += ",";

        // Column 7: Longitude
        csvRow += convertToCsvCell(monument.getLon());

        csvRow += ",";

        // Column 8: City
        csvRow += convertToCsvCell(monument.getCity());

        csvRow += ",";

        // Column 9: State
        csvRow += convertToCsvCell(monument.getState());

        csvRow += ",";

        // Column 10: Address
        csvRow += convertToCsvCell(monument.getAddress());

        csvRow += ",";

        // Column 11: Inscription
        csvRow += convertToCsvCell(monument.getInscription());

        csvRow += ",";

        // Column 12: Description
        csvRow += convertToCsvCell(monument.getDescription());

        csvRow += ",";

        // Column 13: Tags
        csvRow += convertTagsToCsvCell(monument.getTags());

        csvRow += ",";

        // Column 14: Contributors
        csvRow += convertContributionsToCsvCell(monument.getContributions());

        csvRow += ",";

        // Column 15: References
        csvRow += convertReferencesToCsvCell(monument.getReferences());

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
     * Converts a specified Integer value to a CSV formatted cell value
     * @param value - Integer value to convert
     * @return String - CSV formatted cell value using the specified Integer
     */
    private static String convertToCsvCell(Integer value) {
        if (value != null) {
            return Integer.toString(value);
        }
        else {
            return "";
        }
    }

    /**
     * Converts a specified String value into a CSV formatted cell value
     * @param value - String value to convert
     * @return String - CSV formatted cell value using the specified String
     */
    private static String convertToCsvCell(String value) {
        if (value != null && !value.isEmpty()) {
            // Remove any double quotes from the value
            // This is a safeguard to prevent multiple double quotes surrounding outputs
            value = value.replace("\"", "");

            // Wrap the value in double quotes if it contains a comma
            if (value.contains(",")) {
                return addBeginningAndEndingQuotes(value);
            }
            else {
                return value;
            }
        }
        else {
            return "";
        }
    }

    /**
     * Converts a specified Date object into a CSV formatted cell value
     * Uses "dd-MM-yyyy" format
     * @param value - Date object to convert
     * @return String - CSV formatted cell value using the specified Date object
     */
    private static String convertToCsvCell(Date value) {
        if (value != null) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");
            return simpleDateFormat.format(value);
        }
        else {
            return "";
        }
    }

    /**
     * Converts a specified Double value into a CSV formatted cell value
     * @param value - Double to convert
     * @return String - CSV formatted cell value using the specified Double
     */
    private static String convertToCsvCell(Double value) {
        if (value != null) {
            return Double.toString(value);
        }
        else {
            return "";
        }
    }

    /**
     * Converts the specified List of Tags into a CSV formatted cell value
     * @param tags - List<Tag> to convert
     * @return String - CSV formatted cell value using the specified List<Tag>
     */
    private static String convertTagsToCsvCell(List<Tag> tags) {
        StringBuilder tagsCell = new StringBuilder();

        boolean isLastTag;

        if (tags != null) {
            for (int i = 0; i < tags.size(); i++) {
                isLastTag = (i == (tags.size() - 1));
                tagsCell.append(tags.get(i).getName());
                if (!isLastTag) {
                    tagsCell.append(",");
                }
            }

            return addBeginningAndEndingQuotes(tagsCell.toString());
        }
        else {
            return "";
        }
    }

    /**
     * Converts the specified List of Contributions into a CSV formatted cell value
     * @param contributions - List<Contribution> to convert
     * @return String - CSV formatted cell value using the specified List<Contribution>
     */
    private static String convertContributionsToCsvCell(List<Contribution> contributions) {
        StringBuilder contributorsCell = new StringBuilder();

        boolean isLastContribution;

        if (contributions != null) {
            for (int i = 0; i < contributions.size(); i++) {
                isLastContribution = (i == (contributions.size() - 1));
                contributorsCell.append(contributions.get(i).getSubmittedBy());
                if (!isLastContribution) {
                    contributorsCell.append(",");
                }
            }

            return addBeginningAndEndingQuotes(contributorsCell.toString());
        }
        else {
            return "";
        }
    }

    /**
     * Converts the specified List of References into a CSV formatted cell value
     * @param references - List<Reference> to convert
     * @return String - CSV formatted cell using the specfied List<Reference>
     */
    private static String convertReferencesToCsvCell(List<Reference> references) {
        StringBuilder referencesCell = new StringBuilder();

        boolean isLastReference;

        if (references != null) {
            for (int i = 0; i < references.size(); i++) {
                isLastReference = (i == (references.size() - 1));
                referencesCell.append(references.get(i).getUrl());
                if (!isLastReference) {
                    referencesCell.append(",");
                }
            }

            return addBeginningAndEndingQuotes(referencesCell.toString());
        }
        else {
            return "";
        }
    }

    /**
     * Static method to get the header row for CSV file outputs
     * @return String - the CSV header row
     */
    public static String getHeaderRow() {
        return "ID,Title,Artist,Date,Material,Latitude,Longitude,City,State,Address,Inscription,Description," +
                "Tags,Contributors,References";
    }

    private static String formatJpgImageFileName(String fileName) {
        if (!fileName.endsWith(".jpg")) {
            fileName = fileName + ".jpg";
        }

        return fileName;
    }
}
