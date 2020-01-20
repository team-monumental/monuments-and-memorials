package com.monumental.util.csvparsing;

import com.monumental.models.*;
import com.monumental.services.AwsS3Service;
import com.monumental.services.MonumentService;
import com.monumental.util.string.StringHelper;
import com.vividsolutions.jts.geom.Point;

import java.text.SimpleDateFormat;
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
     * Constant for the number of CSV columns currently supported in Bulk Monument Creation
     */
    public static final int numberOfCsvColumns = 14;

    /**
     * Constant for the regex to split on commas only if the comma has zero or an even number of quotes ahead of it
     * See: https://stackoverflow.com/questions/1757065/java-splitting-a-comma-separated-string-but-ignoring-commas-in-quotes
     */
    private static final String csvRegex = ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)";

    /**
     * Static method for converting a CSV row representing a Monument into a CsvMonumentConverterResult object
     * @param csvRow - CSV row representing a Monument, as a String
     * @param fromZipFile - True if the csvRow originated from a .zip file, False otherwise
     * @return CsvMonumentConverterResult - the CsvMonumentConverterResult that is represented by the CSV row
     */
    public static CsvMonumentConverterResult convertCsvRow(String csvRow, boolean fromZipFile) {
        if (csvRow == null) {
            return null;
        }

        String[] csvRowArray = csvRow.split(csvRegex, -1);

        // If the length of the CSV row is not the expected length, throw an exception
        if (csvRowArray.length != numberOfCsvColumns) {
            throw new IllegalArgumentException("Invalid number of CSV columns");
        }

        GregorianCalendar calendar = new GregorianCalendar();

        Monument monument = new Monument();
        CsvMonumentConverterResult result = new CsvMonumentConverterResult();

        Double latitude = null;
        Double longitude = null;

        for (int columnIndex = 0; columnIndex < csvRowArray.length; columnIndex++) {
            // Grab the value at the current column and replace the beginning and ending quotes if applicable
            String value = StringHelper.removeBeginningAndEndingQuotes(csvRowArray[columnIndex]);

            // Skip empty columns
            if (value.isEmpty()) {
                continue;
            }

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
                    // 1. Dates must be in the following format: dd-MM-yyyy
                    // 2. If the day and month are unknown, the cell must contain: yyyy
                    // 3. In the case described in 2, the day and month are set to 01-01
                    String[] dateArray = value.split("-");

                    // Parsing format "yyyy"
                    if (dateArray.length == 1) {
                        monument.setDate(MonumentService.createMonumentDate(dateArray[0]));
                    }
                    // Parsing format "dd-mm-yyyy"
                    else if (dateArray.length == 3) {
                        int monthInt = Integer.parseInt(dateArray[1]);
                        monthInt--;
                        String zeroBasedMonth = Integer.toString(monthInt);

                        monument.setDate(MonumentService.createMonumentDate(dateArray[2], zeroBasedMonth,
                                dateArray[0]));
                    }

                    break;
                case 4: // Materials
                    // Split on commas in-case there are more than one Material in the column
                    String[] materialArray = value.split(",");

                    for (String materialValue : materialArray) {
                        result.getMaterialNames().add(cleanTagName(materialValue));
                    }

                    break;
                case 5: // Inscription
                    monument.setInscription(value);
                    break;
                case 6: // Latitude
                    latitude = Double.parseDouble(value);
                    break;
                case 7: // Longitude
                    longitude = Double.parseDouble(value);
                    break;
                case 8: // City
                    monument.setCity(value);
                    break;
                case 9: // State
                    monument.setState(value);
                    break;
                case 10: // Address
                    monument.setAddress(value);
                    break;
                case 11: // Tags
                    // Split on commas in-case there are more than one Tag in the column
                    String[] tagArray = value.split(",");

                    for (String tagValue : tagArray) {
                        result.getTagNames().add(cleanTagName(tagValue));
                    }

                    break;
                case 12: // Reference
                    Reference newReference = new Reference();
                    newReference.setUrl(value);
                    newReference.setMonument(monument);

                    monument.getReferences().add(newReference);
                    break;
                case 13: // Image filename
                    Image newImage = new Image();
                    newImage.setIsPrimary(true);

                    // If the csvRow came from a .zip file, assume that this column already has an S3 Object URL in it,
                    // meaning we do not need to do any extra work
                    if (fromZipFile) {
                        newImage.setUrl(value);
                    }
                    // Otherwise the csvRow came from a CSV file, meaning we have to transform the filename into
                    // S3 Object URL
                    else {
                        newImage.setUrl(AwsS3Service.getObjectUrl(AwsS3Service.imageBucketName, AwsS3Service.imageFolderName + value));
                    }

                    newImage.setMonument(monument);

                    monument.getImages().add(newImage);
                    break;
            }
        }

        Point point = MonumentService.createMonumentPoint(longitude, latitude);
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
        csvRow += convertTagsToCsvCell(monument.getMaterials());

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
     * Converts the specified List of Tags (or Materials) into a CSV formatted cell value
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

    /**
     * Cleans a CSV Tag name
     * Removes any whitespace and capitalizes the first letter to attempt to avoid duplicates
     * @param tagName - String of the CSV Tag name to clean
     * @return String - The cleaned Tag name
     */
    public static String cleanTagName(String tagName) {
        if (tagName == null) {
            return null;
        }

        if (tagName.isEmpty()) {
            return "";
        }

        tagName = tagName.strip();
        return tagName.substring(0, 1).toUpperCase() + tagName.substring(1);
    }

    /**
     * Get the value of the image filename column from the specified csvRow
     * @param csvRow - String representing the CSV row to get the filename from
     * @return String - Value of the image filename column from the specified csvRow
     */
    public static String getImageFileNameFromCsvRow(String csvRow) {
        if (csvRow == null) {
            return null;
        }

        String[] csvRowArray = csvRow.split(csvRegex, -1);

        // If the length of the CSV row is not the expected length, throw an exception
        if (csvRowArray.length != numberOfCsvColumns) {
            throw new IllegalArgumentException("Invalid number of CSV columns");
        }

        // Get the value of the image filename column, which is the last column in the file
        return csvRowArray[numberOfCsvColumns - 1];
    }

    /**
     * Set the value of the image filename column on the specified csvRow to the specified imageFileName
     * @param csvRow - String representing the CSV row to set the imageFileName on
     * @param imageFileName - String of the image filename to set on the specified CSV row
     * @return String - The new CSV row with the imageFileName set
     */
    public static String setImageFileNameOnCsvRow(String csvRow, String imageFileName) {
        if (csvRow == null || imageFileName == null) {
            return null;
        }

        String[] csvRowArray = csvRow.split(csvRegex, -1);

        // If the length of the CSV row is not the expected length, throw an exception
        if (csvRowArray.length != numberOfCsvColumns) {
            throw new IllegalArgumentException("Invalid number of CSV columns");
        }

        csvRowArray[numberOfCsvColumns - 1] = imageFileName;

        StringBuilder newCsvRowBuilder = new StringBuilder();
        for (int i = 0; i < csvRowArray.length; i++) {
            newCsvRowBuilder.append(csvRowArray[i]);

            if (i != (csvRowArray.length - 1)) {
                newCsvRowBuilder.append(",");
            }
        }

        return newCsvRowBuilder.toString();
    }
}
