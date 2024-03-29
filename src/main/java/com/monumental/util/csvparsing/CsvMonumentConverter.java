package com.monumental.util.csvparsing;

import com.google.gson.Gson;
import com.monumental.models.DateFormat;
import com.monumental.models.suggestions.CreateMonumentSuggestion;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
     * @param csvFileName - name of csv file
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
            DateFormat dateFormat = null;
            DateFormat deactivatedDateFormat = null;
            try {
                for (int i = 0; i < values.size(); i++) {
                    String field = fields.get(i);
                    String value = values.get(i);
                    if (field == null || value.equals("")) continue;
                    switch (field) {
                        case "contributions":
                            result.getContributorNames().addAll(parseCsvArray(value));
                            break;
                        case "artist":
                            suggestion.setArtist(value);
                            break;
                        case "title":
                            suggestion.setTitle(value);
                            break;
                        case "date":
                            String dateFormatString = getDateFormat(value);
                            if (dateFormatString != null) {
                                Date parsedDate = null;
                                dateFormat = stringToDateFormat(dateFormatString);
                                if (dateFormat != DateFormat.UNKNOWN) {//if the date is unknown, then we do not need to make checks for errors
                                    try {
                                        parsedDate = parseDate(value, dateFormatString);
                                    } catch (ParseException e) {
                                        result.getWarnings().add("Date should be a valid date in the format MM/DD/YYYY, DD-MM-YYYY, MM/YYYY, MM-YYYY, or YYYY.");
                                        break;
                                    }
                                    dateForValidate = parsedDate;
                                    if (isDateInFuture(parsedDate)) {
                                        result.getWarnings().add("Date should not be in the future.");
                                        break;
                                    }
                                    if (deactivatedDateForValidate != null && deactivatedDateForValidate.before(parsedDate)) {
                                        if ((dateFormat == DateFormat.EXACT_DATE && deactivatedDateFormat == DateFormat.EXACT_DATE) ||
                                                (dateFormat != DateFormat.YEAR && deactivatedDateFormat != DateFormat.YEAR && (deactivatedDateForValidate.getMonth() < parsedDate.getMonth())) ||
                                                (deactivatedDateForValidate.getYear() < parsedDate.getYear())) {
                                            result.getWarnings().add("Created date should not be after un-installed date.");
                                            break;
                                        }
                                    }
                                }
                                suggestion.setDate(convertDateFormat(value, dateFormatString));
                                suggestion.setDateFormat(dateFormat);
                            } else {
                                result.getWarnings().add("Date should be a valid date in the format MM/DD/YYYY, DD-MM-YYYY, MM/YYYY, MM-YYYY, YYYY, or Unknown.");
                                break;
                            }
                            break;
                        case "deactivatedDate":
                            String deactivatedDateFormatString = getDateFormat(value);
                            if (deactivatedDateFormatString != null) {
                                Date parsedDate = null;
                                deactivatedDateFormat = stringToDateFormat(deactivatedDateFormatString);
                                if (deactivatedDateFormat != DateFormat.UNKNOWN) {
                                    try {
                                        parsedDate = parseDate(value, deactivatedDateFormatString);
                                    } catch (ParseException e) {
                                        result.getWarnings().add("Un-installed date should be a valid date in the format MM/DD/YYYY, DD-MM-YYYY, MM/YYYY, MM-YYYY, or YYYY.");
                                        break;
                                    }
                                    deactivatedDateForValidate = parsedDate;
                                    if (isDateInFuture(parsedDate)) {
                                        result.getWarnings().add("Un-installed date should not be in the future.");
                                        break;
                                    }
                                    if (dateForValidate != null && dateForValidate.after(parsedDate)) {
                                        if ((dateFormat == DateFormat.EXACT_DATE && deactivatedDateFormat == DateFormat.EXACT_DATE) ||
                                                (dateFormat != DateFormat.YEAR && deactivatedDateFormat != DateFormat.YEAR && dateForValidate.getMonth() > parsedDate.getMonth()) ||
                                                (dateForValidate.getYear() < parsedDate.getYear())) {
                                            result.getWarnings().add("Created date should not be after un-installed date.");
                                            break;
                                        }
                                    }
                                }
                                suggestion.setDeactivatedDate(convertDateFormat(value, deactivatedDateFormatString));
                                suggestion.setDeactivatedDateFormat(deactivatedDateFormat);
                            } else {
                                result.getWarnings().add("Un-installed date should be a valid date in the format MM/DD/YYYY, DD-MM-YYYY, MM/YYYY, MM-YYYY, YYYY, or Unknown");
                                break;
                            }
                            break;
                        case "deactivatedComment":
                            suggestion.setDeactivatedComment(value);
                            break;
                        case "materials":
                            result.getMaterialNames().addAll(parseCsvArray(value));
                            break;
                        case "inscription":
                            suggestion.setInscription(value);
                            break;
                        case "latitude":
                            try {
                                if (value.contains("°")) {
                                    if (!result.getWarnings().contains(coordinatesDMSFormatWarning)) {
                                        result.getWarnings().add(coordinatesDMSFormatWarning);
                                        break;
                                    }
                                } else {
                                    latitude = Double.parseDouble(String.format("%.6f", Double.parseDouble(value)));

                                    // Alaska is the furthest north location and its latitude is approximately 71
                                    // The American Samoa is the furthest south location and its latitude is approximately -14
                                    if (latitude > 72 || latitude < -15) {
                                        result.getErrors().add("Latitude is not near the United States");
                                        break;
                                    }
                                    // If not a valid latitude, set it to null because extremely large values can break everything
                                    if (latitude > 90 || latitude < -90) {
                                        latitude = null;
                                    }
                                }
                            } catch (NumberFormatException e) {
                                result.getWarnings().add(latitudeNumberFormatExceptionWarning);
                                break;
                            } finally {
                                suggestion.setLatitude(latitude);
                            }
                            break;
                        case "longitude":
                            try {
                                if (value.contains("°")) {
                                    if (!result.getWarnings().contains(coordinatesDMSFormatWarning)) {
                                        result.getWarnings().add(coordinatesDMSFormatWarning);
                                        break;
                                    }
                                } else {
                                    longitude = Double.parseDouble(String.format("%.6f", Double.parseDouble(value)));

                                    // Guam is the furthest west location and its longitude is approximately 144
                                    // Puerto Rico is the furthest east location and its longitude is approximately -65
                                    if (longitude > -64 && !(longitude < 180 && longitude > 143)) {
                                        result.getErrors().add("Longitude is not near the United States");
                                        break;
                                    }
                                    // If not a valid longitude, set it to null because extremely large values can break everything
                                    if (longitude > 180 || longitude < -180) {
                                        longitude = null;
                                    }
                                }
                            } catch (NumberFormatException e) {
                                result.getWarnings().add(longitudeNumberFormatExceptionWarning);
                                break;
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
                        case "description":
                            suggestion.setDescription(value);
                            break;
                        case "tags":
                            result.getTagNames().addAll(parseCsvArray(value));
                            break;
                        case "references":
                            result.getReferenceUrls().addAll(parseCsvArray(value, true));
                            break;
                        case "is_temporary":
                            suggestion.setIsTemporary(Boolean.valueOf(value));
                            break;
                        case "images":
                            if (zipFile != null) {
                                String[] valueArray = value.split(", ");
                                for (String imageValue : valueArray) {
                                    Enumeration zipEntries = zipFile.entries();
                                    while (zipEntries.hasMoreElements()) {
                                        String fileName = ((ZipEntry) zipEntries.nextElement()).getName();
                                        if (fileName.contains(imageValue)) {
                                            imageValue = fileName;
                                            break;
                                        }
                                    }
                                    try {
                                        ZipEntry imageZipEntry = zipFile.getEntry(imageValue);
                                        if (imageZipEntry == null) {
                                            result.getWarnings().add("Could not find image " + imageValue + " in .zip file. File may be missing or named incorrectly.");
                                        } else {
                                            try {
                                                File imageFile = ZipFileHelper.convertZipEntryToFile(zipFile, imageZipEntry);
                                                if (imageFile.length() > 5000000) {
                                                    result.getWarnings().add("Image file is too large. Maximum file size is 5MB.");
                                                } else {
                                                    result.getImageFiles().add(imageFile);
                                                }
                                            } catch (IOException e) {
                                                result.getErrors().add("Failed to read image file from .zip");
                                            }
                                        }
                                    } catch (Exception e) {
                                        result.getWarnings().add("Could not find image " + imageValue + " in .zip file. File may be missing or named incorrectly.");
                                    }
                                }
                            } else {
                                result.getWarnings().add("Cannot upload images with a .csv file. You must package your .csv and your images into a .zip file and upload it.");
                            }
                            break;
                        case "imageReferenceUrls":
                            if (zipFile != null) {
                                result.getImageReferenceUrls().addAll(parseCsvArray(value, true));
                            } else {
                                result.getWarnings().add("Cannot add image reference URLs without images");
                            }
                            break;
                        case "imageCaptions":
                            if (zipFile != null) {
                                result.getImageCaptions().addAll(parseCsvArray(value));
                            } else {
                                result.getWarnings().add("Cannot add image captions without images.");
                            }
                            break;
                        case "photoSphereImages":
                            List<String> photoSphereImages = parseCsvArray(value, true);
                            for (int photoSphereI = 0; photoSphereI < photoSphereImages.size(); photoSphereI++) {
                                String photoSphereImage = photoSphereImages.get(photoSphereI);
                                Pattern srcPattern = Pattern.compile("src=\"([^\"]+)\"");
                                Matcher m = srcPattern.matcher(photoSphereImage);
                                try{
                                    String photoSphereSrc = "";
                                    while (m.find()) {
                                        photoSphereSrc = m.group(1);
                                    }
                                    photoSphereImages.set(photoSphereI, photoSphereSrc);
                                } catch (Exception e) {
                                    result.getErrors().add("Failed to extract source URL from 360 image HTML. Please make sure it is properly formatted.");
                                }
                            }
                            result.getPhotoSphereImages().addAll(photoSphereImages);
                            break;
                        case "photoSphereImageReferenceUrls":
                            result.getPhotoSphereImageReferenceUrls().addAll(parseCsvArray(value, true));
                            break;
                        case "photoSphereImageCaptions":
                            result.getPhotoSphereImageCaptions().addAll(parseCsvArray(value));
                            break;
                        default:
                            if (i == 0) {
                                suggestion.setTitle(value);
                            }
                            break;
                    }
                }

                if ((suggestion.getDeactivatedDate() == null || suggestion.getDeactivatedDate().isEmpty()) &&
                        (suggestion.getDeactivatedYear() == null || suggestion.getDeactivatedYear().isEmpty()) &&
                        (suggestion.getDeactivatedComment() != null && !suggestion.getDeactivatedComment().isEmpty())) {
                    suggestion.setDeactivatedComment(null);
                    result.getWarnings().add("Un-installed date is required in order to have a un-installed comment");
                }
            } catch (Exception e) {
                result.getErrors().add("Unknown error. Please check that this row is formatted properly.");
            }

            result.setMonumentSuggestion(suggestion);
            result.validate();

            if(isCSVRowNotEmpty(result)){
                results.add(result);
            }
        }
        return results;
    }

    /**
     * Determines if the row in the CSV is empty or not by seeing if any of the fields have values or not
     * @param result - CsvMonumentConverterResult class to check
     * @return boolean - true if not empty, false if empty
     */
    private static boolean isCSVRowNotEmpty(CsvMonumentConverterResult result) {
        return !result.getContributorNames().isEmpty() ||
                result.getMonumentSuggestion().getArtist() != null ||
                result.getMonumentSuggestion().getTitle() != null ||
                !result.getMaterialNames().isEmpty() ||
                result.getMonumentSuggestion().getLatitude() != null ||
                result.getMonumentSuggestion().getLongitude() != null ||
                result.getMonumentSuggestion().getCity() != null ||
                result.getMonumentSuggestion().getState() != null ||
                result.getMonumentSuggestion().getAddress() != null ||
                result.getMonumentSuggestion().getInscription() != null ||
                result.getMonumentSuggestion().getDescription() != null ||
                !result.getTagNames().isEmpty() ||
                !result.getImageFiles().isEmpty() ||
                !result.getImageReferenceUrls().isEmpty() ||
                !result.getImageCaptions().isEmpty() ||
                !result.getReferenceUrls().isEmpty() ||
                !result.getPhotoSphereImages().isEmpty() ||
                !result.getPhotoSphereImageReferenceUrls().isEmpty() ||
                !result.getPhotoSphereImageCaptions().isEmpty() ||
                result.getMonumentSuggestion().getDeactivatedDate() != null ||
                result.getMonumentSuggestion().getDeactivatedComment() != null;
    }

    /**
     * Determine if the specified value can be parsed into a valid Date
     * Dates must be in one of the following formats: dd-MM-yyyy, MM/dd/yyyy, MM-yyyy, MM/yyyy, yyyy
     * Any other format is considered invalid
     * @param value - String to determine if it can be parsed into a valid Date
     * @return - String date format if valid, null otherwise
     */
    private static String getDateFormat(String value) {
        if (value.toLowerCase().matches("^\\d{1,2}/\\d{1,2}/\\d{4}$")) {
            return "MM/dd/yyyy";
        } else if (value.toLowerCase().matches("^\\d{1,2}/\\d{1,2}/\\d{2}$")) {
            return "MM/dd/yy";
        } else if (value.toLowerCase().matches("^\\d{1,2}/\\d{4}$")) {
            return "MM/yyyy";
        } else if (value.toLowerCase().matches("^\\d{1,2}-\\d{1,2}-\\d{4}$")) {
            return "dd-MM-yyyy";
        } else if (value.toLowerCase().matches("^\\d{1,2}-\\d{4}$")) {
            return "MM-yyyy";
        } else if (value.toLowerCase().matches("^\\d{4}$")) {
            return "yyyy";
        } else if (value.toLowerCase().matches("unknown")) {
            return "unknown";
        } else {
            return null;
        }
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
    private static Date parseDate(String value, String dateFormatString) throws DateTimeParseException, ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat(dateFormatString);
        return dateFormat.parse(value);
    }

    /**
     * Converts date from dd-mm-yyyy to yyyy-mm-dd
     * @param jsonDate - String date to convert
     * @return String - converted date
     */
    public static String convertDateFormat(String jsonDate, String oldDateFormatString) {
        if (isNullOrEmpty(jsonDate)) {
            return null;
        }

        SimpleDateFormat oldDateFormat = new SimpleDateFormat(oldDateFormatString);
        SimpleDateFormat newDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

        try {
            Date date = oldDateFormat.parse(jsonDate);
            return newDateFormat.format(date);
        } catch (ParseException e) {
            return jsonDate;
        }
    }

    public static DateFormat stringToDateFormat(String dateFormatString) {
        switch (dateFormatString) {
            case "MM/dd/yyyy":
            case "MM/dd/yy":
            case "dd-MM-yyyy":
                return DateFormat.EXACT_DATE;
            case "MM/yyyy":
            case "MM-yyyy":
                return DateFormat.MONTH_YEAR;
            case "yyyy":
                return DateFormat.YEAR;
            case "unknown":
                return DateFormat.UNKNOWN;
            default:
                return null;
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

    private static List<String> parseCsvArray(String value) {
        return parseCsvArray(value, false);
    }

    private static List<String> parseCsvArray(String value, boolean isUrl) {
        // Split on commas in-case there are more than one Tag in the column
        String[] valueArray = value.split(", ");

        List<String> names = new ArrayList<>();

        for (String arrayValue : valueArray) {
            String name = arrayValue;
            if (!isUrl) {
                name = cleanTagName(arrayValue);
            }
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
        if (result.getImageReferenceUrls() != null && result.getImageReferenceUrls().size() > 0) {
            suggestion.setImageReferenceUrlsJson(gson.toJson(result.getImageReferenceUrls()));
        }
        if (result.getImageCaptions() != null && result.getImageCaptions().size() > 0) {
            suggestion.setImageCaptionsJson(gson.toJson(result.getImageCaptions()));
        }
        if (result.getPhotoSphereImages() != null && result.getPhotoSphereImages().size() > 0) {
            suggestion.setPhotoSphereImagesJson(gson.toJson(result.getPhotoSphereImages()));
        }
        if (result.getPhotoSphereImageReferenceUrls() != null && result.getPhotoSphereImageReferenceUrls().size() > 0) {
            suggestion.setPhotoSphereImageReferenceUrlsJson(gson.toJson(result.getPhotoSphereImageReferenceUrls()));
        }
        if (result.getPhotoSphereImageCaptions() != null && result.getPhotoSphereImageCaptions().size() > 0) {
            suggestion.setPhotoSphereImageCaptionsJson(gson.toJson(result.getPhotoSphereImageCaptions()));
        }

        return suggestion;
    }
}
