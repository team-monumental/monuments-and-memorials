package com.monumental.util.csvparsing;

import com.monumental.models.Contribution;
import com.monumental.models.Reference;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.services.MonumentService;

import java.io.IOException;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Class used to:
 * 1. Convert a CSV row representing a Monument into a CsvMonumentConverterResult object
 * 2. Convert a Monument into a CSV row
 * 3. Convert a CsvMonumentConverterResult object into a CreateMonumentSuggestion object
 */
public class CsvMonumentConverter {

    /**
     * Convert CSV rows into CsvMonumentConverterResults
     * @param csvRows - List of String Arrays of cells in a CSV
     * @param mapping - The field mapping between the CSV's headers and our fields, provided by the user
     * @param zipFile - The zip file containing the images to be uploaded, or null if a csv was uploaded directly
     * @return The conversion results, with any warnings or errors
     */
    public static List<CsvMonumentConverterResult> convertCsvRows(List<String[]> csvRows, Map<String, String> mapping,
                                                                  ZipFile zipFile) {
        String[] headers = csvRows.get(0);
        csvRows.remove(0);

        Map<Integer, String> fields = CsvFileHelper.getFieldPositions(headers, mapping);
        List<CsvMonumentConverterResult> results = new ArrayList<>();
        for (String[] row : csvRows) {
            List<String> values = Arrays.asList(row);
            CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
            CsvMonumentConverterResult result = new CsvMonumentConverterResult();
            Double latitude = null;
            Double longitude = null;
            for (int i = 0; i < values.size(); i++) {
                String field = fields.get(i);
                String value = values.get(i);
                if (field == null || value.equals("")) continue;
                switch (field) {
                    case "contributions":
                        result.getContributorNames().add(value);
                        break;
                    case "artist":
                        suggestion.setArtist(value);
                        break;
                    case "title":
                        suggestion.setTitle(value);
                        break;
                    case "date":
                        try {
                            parseDate(value);
                        } catch (Exception e) {
                            result.getWarnings().add("Date should be a valid date in the format DD-MM-YYYY or YYYY.");
                        } finally {
                            suggestion.setDate(value);
                        }
                        break;
                    case "materials":
                        result.getMaterialNames().addAll(parseCsvTags(value));
                        break;
                    case "inscription":
                        suggestion.setInscription(value);
                        break;
                    case "latitude":
                        try {
                            latitude = Double.parseDouble(value);
                        } catch (NumberFormatException e) {
                            result.getWarnings().add("Latitude should be a valid number.");
                        } finally {
                            suggestion.setLatitude(latitude);
                        }
                        break;
                    case "longitude":
                        try {
                            longitude = Double.parseDouble(value);
                        } catch (NumberFormatException e) {
                            result.getWarnings().add("Longitude should be a valid number.");
                        } finally {
                            suggestion.setLongitude(longitude);
                        }
                        break;
                    case "city":
                        suggestion.setCity(value);
                        break;
                    case "state":
                        suggestion.setState(value);
                        break;
                    case "address":
                        suggestion.setAddress(value);
                        break;
                    case "tags":
                        result.getTagNames().addAll(parseCsvTags(value));
                        break;
                    case "references":
                        result.getReferenceUrls().add(value);
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

            result.setMonumentSuggestion(suggestion);
            result.validate();
            results.add(result);
        }
        return results;
    }

    private static Contribution parseSuggestionContributor(String contributor) {
        GregorianCalendar calendar = new GregorianCalendar();
        Contribution contribution = new Contribution();
        contribution.setDate(calendar.getTime());
        contribution.setSubmittedBy(contributor);
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

    private static List<String> parseCsvTags(String value) {
        // Split on commas in-case there are more than one Tag in the column
        String[] materialArray = value.split(",");

        List<String> names = new ArrayList<>();

        for (String materialValue : materialArray) {
            String name = cleanTagName(materialValue);
            if (name == null || name.equals("")) continue;
            names.add(name);
        }
        return names;
    }

    private static Reference parseSuggestionReference(String url) {
        Reference reference = new Reference();
        reference.setUrl(url);
        return reference;
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
        }
        return null;
    }
}
