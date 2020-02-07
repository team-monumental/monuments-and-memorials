package com.monumental.util.csvparsing;

import com.monumental.models.Contribution;
import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.models.Tag;
import com.monumental.services.MonumentService;
import com.vividsolutions.jts.geom.Point;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Class used to:
 * 1. Convert a CSV row representing a Monument into a CsvMonumentConverterResult object
 * 2. Convert a Monument into a CSV row
 */
public class CsvMonumentConverter {

    public static List<CsvMonumentConverterResult> convertCsvRows(List<String[]> csvRows, Map<String, String> mapping,
                                                                  ZipFile zipFile) {
        String[] headers = csvRows.get(0);
        csvRows.remove(0);

        Map<Integer, String> fields = CsvFileHelper.getFieldPositions(headers, mapping);
        List<CsvMonumentConverterResult> results = new ArrayList<>();
        for (String[] row : csvRows) {
            List<String> values = Arrays.asList(row);
            Monument monument = new Monument();
            CsvMonumentConverterResult result = new CsvMonumentConverterResult();
            Double latitude = null;
            Double longitude = null;
            for (int i = 0; i < values.size(); i++) {
                String field = fields.get(i);
                String value = values.get(i);
                if (field == null || value.equals("")) continue;
                switch (field) {
                    case "submittedBy":
                        Contribution contribution = parseContribution(value);
                        contribution.setMonument(monument);
                        monument.getContributions().add(contribution);
                        break;
                    case "artist":
                        monument.setArtist(value);
                        break;
                    case "title":
                        monument.setTitle(value);
                        break;
                    case "date":
                        try {
                            monument.setDate(parseDate(value));
                        } catch (Exception e) {
                            result.getWarnings().add("Date should be a valid date in the format DD-MM-YYYY or YYYY.");
                        }
                        break;
                    case "materials":
                        result.getMaterialNames().addAll(parseTags(value));
                        break;
                    case "inscription":
                        monument.setInscription(value);
                        break;
                    case "latitude":
                        try {
                            latitude = Double.parseDouble(value);
                        } catch (NumberFormatException e) {
                            result.getWarnings().add("Latitude should be a valid number.");
                        }
                        break;
                    case "longitude":
                        try {
                            longitude = Double.parseDouble(value);
                        } catch (NumberFormatException e) {
                            result.getWarnings().add("Longitude should be a valid number.");
                        }
                        break;
                    case "city":
                        monument.setCity(value);
                        break;
                    case "state":
                        monument.setState(value);
                        break;
                    case "address":
                        monument.setAddress(value);
                        break;
                    case "tags":
                        result.getTagNames().addAll(parseTags(value));
                        break;
                    case "reference":
                        Reference reference = parseReference(value);
                        reference.setMonument(monument);
                        monument.getReferences().add(reference);
                        break;
                    case "images":
                        if (zipFile != null) {
                            ZipEntry imageZipEntry = zipFile.getEntry(value);
                            if (imageZipEntry == null) {
                                result.getWarnings().add("Could not find image in .zip file. File may be missing or named incorrectly.");
                            } else {
                                try {
                                    result.getImageFiles().add(ZipFileHelper.convertZipEntryToFile(zipFile, imageZipEntry));
                                } catch (IOException e) {
                                    result.getErrors().add("Failed to read image file from .zip");
                                }
                            }
                        } else {
                            result.getWarnings().add("Cannot upload images with a .csv file. You must package your .csv and your images into a .zip file and upload it.");
                        }
                        break;
                }
            }

            Point point = MonumentService.createMonumentPoint(longitude, latitude);
            monument.setCoordinates(point);

            result.setMonument(monument);
            result.validate();
            results.add(result);
        }
        return results;
    }

    private static Contribution parseContribution(String value) {
        GregorianCalendar calendar = new GregorianCalendar();
        Contribution contribution = new Contribution();
        contribution.setDate(calendar.getTime());
        contribution.setSubmittedBy(value);
        return contribution;
    }

    private static Date parseDate(String value) {
        // 1. Dates must be in the following format: dd-MM-yyyy
        // 2. If the day and month are unknown, the cell must contain: yyyy
        // 3. In the case described in 2, the day and month are set to 01-01
        String[] dateArray = value.split("-");

        // Parsing format "yyyy"
        if (dateArray.length == 1) {
            return MonumentService.createMonumentDate(dateArray[0]);
        }
        // Parsing format "dd-mm-yyyy"
        else if (dateArray.length == 3) {
            int monthInt = Integer.parseInt(dateArray[1]);
            monthInt--;
            String zeroBasedMonth = Integer.toString(monthInt);

            return MonumentService.createMonumentDate(dateArray[2], zeroBasedMonth,
                    dateArray[0]);
        } else {
            return null;
        }
    }

    private static List<String> parseTags(String value) {
        // Split on commas in-case there are more than one Material in the column
        String[] materialArray = value.split(",");

        List<String> names = new ArrayList<>();

        for (String materialValue : materialArray) {
            String name = cleanTagName(materialValue);
            if (name == null || name.equals("")) continue;
            names.add(name);
        }
        return names;
    }

    private static Reference parseReference(String value) {
        Reference reference = new Reference();
        reference.setUrl(value);
        return reference;
    }

    /**
     * Static method for converting a specified Monument into a CSV row
     * @param monument - Monument to convert into a CSV row
     * @return String - CSV row representing the specified Monument
     */
    public static String convertMonument(Monument monument) {
        return String.join(",", new String[]{
            convertToCsvCell(monument.getId()),
            convertToCsvCell(monument.getTitle()),
            convertToCsvCell(monument.getArtist()),
            convertToCsvCell(monument.getDate()),
            convertTagsToCsvCell(monument.getMaterials()),
            convertToCsvCell(monument.getLat()),
            convertToCsvCell(monument.getLon()),
            convertToCsvCell(monument.getCity()),
            convertToCsvCell(monument.getState()),
            convertToCsvCell(monument.getAddress()),
            convertToCsvCell(monument.getInscription()),
            convertToCsvCell(monument.getDescription()),
            convertTagsToCsvCell(monument.getTags()),
            convertContributionsToCsvCell(monument.getContributions()),
            convertReferencesToCsvCell(monument.getReferences())
        });
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
        List<String> tagStrings = new ArrayList<>();
        for (Tag tag : tags) {
            tagStrings.add(tag.getName());
        }
        return addBeginningAndEndingQuotes(String.join(",", tagStrings));
    }

    /**
     * Converts the specified List of Contributions into a CSV formatted cell value
     * @param contributions - List<Contribution> to convert
     * @return String - CSV formatted cell value using the specified List<Contribution>
     */
    private static String convertContributionsToCsvCell(List<Contribution> contributions) {
        List<String> contributionStrings = new ArrayList<>();
        for (Contribution contribution : contributions) {
            contributionStrings.add(contribution.getSubmittedBy());
        }
        return addBeginningAndEndingQuotes(String.join(",", contributionStrings));
    }

    /**
     * Converts the specified List of References into a CSV formatted cell value
     * @param references - List<Reference> to convert
     * @return String - CSV formatted cell using the specfied List<Reference>
     */
    private static String convertReferencesToCsvCell(List<Reference> references) {
        List<String> referenceStrings = new ArrayList<>();
        for (Reference reference : references) {
            referenceStrings.add(reference.getUrl());
        }
        return addBeginningAndEndingQuotes(String.join(",", referenceStrings));
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
        if (tagName.length() > 0) {
            return tagName.substring(0, 1).toUpperCase() + tagName.substring(1);
        } else return null;
    }
}
