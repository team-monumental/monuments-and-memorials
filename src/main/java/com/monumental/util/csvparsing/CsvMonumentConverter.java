package com.monumental.util.csvparsing;

import com.google.gson.Gson;
import com.monumental.models.DateFormat;
import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.services.MonumentService;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

/**
 * Class used to:
 * 1. Convert a CSV row representing a Monument into a CsvMonumentConverterResult object
 * 2. Convert a Monument into a CSV row
 * 3. Convert a CsvMonumentConverterResult object into a CreateMonumentSuggestion object
 */
public class CsvMonumentConverter {

    public static final String coordinatesDMSFormatWarning = "Please use decimal coordinates, not degrees. To " +
            "convert, input your degrees into Google Maps.";

    public static final String longitudeNumberFormatExceptionWarning = "Longitude should be a valid number.";

    public static final String latitudeNumberFormatExceptionWarning = "Latitude should be a valid number.";

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
        for (int j = 0; j < csvRows.size(); j++) {
            String[] row = csvRows.get(j);
            List<String> values = Arrays.asList(row);
            CreateMonumentSuggestion suggestion = new CreateMonumentSuggestion();
            CsvMonumentConverterResult result = new CsvMonumentConverterResult();
            Double latitude = null;
            Double longitude = null;
            Date dateForValidate = null;
            Date deactivatedDateForValidate = null;
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
                        if (canParseDate(value)) {
                            Date parsedDate = parseDate(value);
                            dateForValidate = parsedDate;
                            if (isDateInFuture(parsedDate)) {
                                result.getWarnings().add("Date should not be in the future.");
                            }
                            if (deactivatedDateForValidate != null && deactivatedDateForValidate.before(parsedDate)) {
                                result.getWarnings().add("Created date should not be after deactivated date.");
                            }
                        }
                        else {
                            result.getWarnings().add("Date should be a valid date in the format DD-MM-YYYY or YYYY.");
                        }
                        suggestion.setDate(convertDateFormat(value));
                        break;
                    case "dateFormat":
                        suggestion.setDateFormat(DateFormat.valueOf(value));
                        break;
                    case "deactivatedDate":
                        if (canParseDate(value)) {
                            Date parsedDate = parseDate(value);
                            deactivatedDateForValidate = parsedDate;
                            if (isDateInFuture(parsedDate)) {
                                result.getWarnings().add("Deactivated date should not be in the future.");
                            }
                            if (dateForValidate != null && dateForValidate.after(parsedDate)) {
                                result.getWarnings().add("Created date should not be after deactivated date.");
                            }
                        }
                        else {
                            result.getWarnings().add("Deactivated date should be a valid date in the format DD-MM-YYYY or YYYY.");
                        }
                        suggestion.setDeactivatedDate(convertDateFormat(value));
                        break;
                    case "deactivatedDateFormat":
                        suggestion.setDeactivatedDateFormat(DateFormat.valueOf(value));
                        break;
                    case "deactivatedComment":
                        suggestion.setDeactivatedComment(value);
                        break;
                    case "materials":
                        result.getMaterialNames().addAll(parseCsvTags(value));
                        break;
                    case "inscription":
                        suggestion.setInscription(value);
                        break;
                    case "latitude":
                        try {
                            if (value.contains("°")) {
                                if (!result.getWarnings().contains(coordinatesDMSFormatWarning)) {
                                    result.getWarnings().add(coordinatesDMSFormatWarning);
                                }
                            } else {
                                latitude = Double.parseDouble(value);

                                // Alaska is the furthest north location and its latitude is approximately 71
                                // The American Samoa is the furthest south location and its latitude is approximately -14
                                if (latitude > 72 || latitude < -15) {
                                    result.getErrors().add("Latitude is not near the United States");
                                }
                                // If not a valid latitude, set it to null because extremely large values can break everything
                                if (latitude > 90 || latitude < -90) {
                                    latitude = null;
                                }
                            }
                        } catch (NumberFormatException e) {
                            result.getWarnings().add(latitudeNumberFormatExceptionWarning);
                        } finally {
                            suggestion.setLatitude(latitude);
                        }
                        break;
                    case "longitude":
                        try {
                            if (value.contains("°")) {
                                if (!result.getWarnings().contains(coordinatesDMSFormatWarning)) {
                                    result.getWarnings().add(coordinatesDMSFormatWarning);
                                }
                            } else {
                                longitude = Double.parseDouble(value);

                                // Guam is the furthest west location and its longitude is approximately 144
                                // Puerto Rico is the furthest east location and its longitude is approximately -65
                                if (longitude > -64 && !(longitude < 180 && longitude > 143)) {
                                    result.getErrors().add("Longitude is not near the United States");
                                }
                                // If not a valid longitude, set it to null because extremely large values can break everything
                                if (longitude > 180 || longitude < -180) {
                                    longitude = null;
                                }
                            }
                        } catch (NumberFormatException e) {
                            result.getWarnings().add(longitudeNumberFormatExceptionWarning);
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
                                    File imageFile = ZipFileHelper.convertZipEntryToFile(zipFile, imageZipEntry);
                                    if (imageFile.length() > 5000000) {
                                        result.getWarnings().add("Image file is too large. Maximum file size is 5MB.");
                                    }
                                    else {
                                        result.getImageFiles().add(imageFile);
                                    }
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

            if ((suggestion.getDeactivatedDate() == null || suggestion.getDeactivatedDate().isEmpty()) &&
                    (suggestion.getDeactivatedYear() == null || suggestion.getDeactivatedYear().isEmpty()) &&
                    (suggestion.getDeactivatedComment() != null && !suggestion.getDeactivatedComment().isEmpty())) {
                result.getWarnings().add("Deactivated date is required in order to have a deactivated comment");
            }

            result.setMonumentSuggestion(suggestion);
            result.validate();
            results.add(result);
        }
        return results;
    }

    /**
     * Determine if the specified value can be parsed into a valid Date
     * Dates must be in the following format: dd-MM-yyyy
     * If the day and month are unknown, then the date can also be in yyyy format
     * Any other format is considered invalid
     * @param value - String to determine if it can be parsed into a valid Date
     * @return - True if the specified value can be parsed into a valid Date, False otherwise
     */
    private static boolean canParseDate(String value) {
        // "dd-MM-yyyy" format
        if (value.contains("-")) {
            String[] dateArray = value.split("-");
            return dateArray.length == 3;
        }

        // "yyyy" format
        return value.length() == 4 && value.matches("[0-9]+");
    }

    /**
     * Actually parse the specified value into a Date
     * Dates must be in the following format: dd-MM-yyyy
     * If the day and month are unknown, then the date can also be in yyyy format
     * Any other format is considered invalid
     * @param value - String to parse into a Date
     * @return Date - Date object created from parsing the specified value
     * @throws DateTimeParseException - If the specified value can not be parsed into a Date
     */
    private static Date parseDate(String value) throws DateTimeParseException {
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
            throw new DateTimeParseException("Invalid date format", value, 0);
        }
    }

    /**
     * Determine if the specified date is in the future
     * @param date - Date object to determine if it is in the future
     * @return - True if the specified date is in the future, False otherwise
     */
    private static boolean isDateInFuture(Date date) {
        if (date != null) {
            Date currentDate = new Date();
            return date.after(currentDate);
        }

        return false;
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

    /**
     * Parse a specified CsvMonumentConverterResult into a complete CreateMonumentSuggestion
     * @param result - CsvMonumentConverterResult class to parse
     * @param gson - Gson object used to convert object to JSON
     * @return CreateMonumentSuggestion - CreateMonumentSuggestion object created from the specified
     * CsvMonumentConverterResult
     */
    public static CreateMonumentSuggestion parseCsvMonumentConverterResult(CsvMonumentConverterResult result, Gson gson) {
        if (result == null || result.getMonumentSuggestion() == null || gson == null) {
            return null;
        }

        CreateMonumentSuggestion suggestion = result.getMonumentSuggestion();

        if (result.getContributorNames() != null && result.getContributorNames().size() > 0) {
            suggestion.setContributionsJson(gson.toJson(result.getContributorNames()));
        }
        if (result.getReferenceUrls() != null && result.getReferenceUrls().size() > 0) {
            suggestion.setReferencesJson(gson.toJson(result.getReferenceUrls()));
        }
        if (result.getTagNames() != null && result.getTagNames().size() > 0) {
            suggestion.setTagsJson(gson.toJson(result.getTagNames()));
        }
        if (result.getMaterialNames() != null && result.getMaterialNames().size() > 0) {
            suggestion.setMaterialsJson(gson.toJson(result.getMaterialNames()));
        }

        return suggestion;
    }

    /**
     * Converts date from dd-mm-yyyy to yyyy-mm-dd
     * @param jsonDate - String date to convert
     * @return String - converted date
     */
    public static String convertDateFormat(String jsonDate) {
        if (isNullOrEmpty(jsonDate)) {
            return null;
        }

        SimpleDateFormat oldDateFormat = new SimpleDateFormat("dd-MM-yyyy");
        SimpleDateFormat newDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

        try {
//            Date date = parseDate(jsonDate);
            Date date = oldDateFormat.parse(jsonDate);
            return newDateFormat.format(date);
        } catch (ParseException e) {
            return null;
        }
    }
}
