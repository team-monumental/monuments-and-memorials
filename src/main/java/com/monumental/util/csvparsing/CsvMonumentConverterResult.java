package com.monumental.util.csvparsing;

import com.monumental.models.suggestions.CreateMonumentSuggestion;
import com.monumental.util.string.StringHelper;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.monumental.util.csvparsing.CsvMonumentConverter.*;
import static com.monumental.util.string.StringHelper.isNullOrEmpty;

/**
 * Class used to encapsulate a result of calling CsvMonumentConverter.convertCsvRowToMonument
 */
public class CsvMonumentConverterResult {

    private CreateMonumentSuggestion monumentSuggestion;

    private List<String> contributorNames = new ArrayList<>();

    private List<String> referenceUrls = new ArrayList<>();

    private Set<String> tagNames = new HashSet<>();

    private Set<String> materialNames = new HashSet<>();

    private List<File> imageFiles = new ArrayList<>();

    private List<String> errors = new ArrayList<>();

    private List<String> warnings = new ArrayList<>();

    public CreateMonumentSuggestion getMonumentSuggestion() {
        return this.monumentSuggestion;
    }

    public void setMonumentSuggestion(CreateMonumentSuggestion monumentSuggestion) {
        this.monumentSuggestion = monumentSuggestion;
    }

    public List<String> getContributorNames() {
        return this.contributorNames;
    }

    public void setContributorNames(List<String> contributorNames) {
        this.contributorNames = contributorNames;
    }

    public List<String> getReferenceUrls() {
        return this.referenceUrls;
    }

    public void setReferenceUrls(List<String> referenceUrls) {
        this.referenceUrls = referenceUrls;
    }

    public Set<String> getTagNames() {
        return this.tagNames;
    }

    public void setTagNames(Set<String> tagNames) {
        this.tagNames = tagNames;
    }

    public Set<String> getMaterialNames() {
        return this.materialNames;
    }

    public void setMaterialNames(Set<String> materialNames) {
        this.materialNames = materialNames;
    }

    public List<File> getImageFiles() {
        return this.imageFiles;
    }

    public void setImageFiles(List<File> imageFiles) {
        this.imageFiles = imageFiles;
    }

    public List<String> getErrors() {
        return this.errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public List<String> getWarnings() {
        return this.warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }

    /**
     * Validates this CsvMonumentConverterResult, populating errors and warnings
     */
    public void validate() {
        if (this.monumentSuggestion == null) {
            this.getErrors().add("Monument Suggestion can not be null");
        }

        /* Title Validation */
        /* Title is a required field */
        if (isNullOrEmpty(this.monumentSuggestion.getTitle())) {
            this.getErrors().add("Title is required");
        }

        /* Materials Validation */
        /* Materials is a required field */
        if (this.getMaterialNames() == null || this.getMaterialNames().size() == 0) {
            this.getErrors().add("At least one Material is required");
        }

        /* Address or Coordinates Validation */
        /* An Address OR Coordinates must be specified */
        if (isNullOrEmpty(this.monumentSuggestion.getAddress()) &&
                (this.monumentSuggestion.getLatitude() == null || this.monumentSuggestion.getLongitude() == null)) {
            List<String> warnings = this.getWarnings();
            List<String> errors = this.getErrors();
            // If Lat/Long are missing because of any of these three warnings, elevate them to errors
            if (warnings.contains(coordinatesDMSFormatWarning)) {
                warnings.remove(coordinatesDMSFormatWarning);
                errors.add(coordinatesDMSFormatWarning);
            // This isn't a particularly pretty check but if we use if-else here and they're both invalid, one will be a
            // warning while the other will be an error, which is strange
            } else if (warnings.contains(latitudeNumberFormatExceptionWarning) || warnings.contains(longitudeNumberFormatExceptionWarning)) {
                if (warnings.contains(latitudeNumberFormatExceptionWarning)) {
                    warnings.remove(latitudeNumberFormatExceptionWarning);
                    errors.add(latitudeNumberFormatExceptionWarning);
                }
                if (warnings.contains(longitudeNumberFormatExceptionWarning)) {
                    warnings.remove(longitudeNumberFormatExceptionWarning);
                    errors.add(longitudeNumberFormatExceptionWarning);
                }
            // Otherwise, the data is actually missing, so add that as an error
            } else {
                this.getErrors().add("Address OR Coordinates are required");
            }
        }

        /* Latitude Validation */
        /* Check that the latitude is within a valid range and formatted correctly */
        if (isNullOrEmpty(this.monumentSuggestion.getAddress()) && this.monumentSuggestion.getLatitude() != null) {
            String latitudeString = this.monumentSuggestion.getLatitude().toString();
            if (!latitudeString.matches(StringHelper.latitudeRegex)) {
                this.getErrors().add("Latitude must be valid");
            }
        }

        /* Longitude Validation */
        /* Check that the longitude is within a valid range and formatted correctly */
        if (isNullOrEmpty(this.monumentSuggestion.getAddress()) && this.monumentSuggestion.getLongitude() != null) {
            String longitudeString = this.monumentSuggestion.getLongitude().toString();
            if (!longitudeString.matches(StringHelper.longitudeRegex)) {
                this.getErrors().add("Longitude must be valid");
            }
        }

        /* References Validation */
        /* Check that the references are valid URLs */
        if (this.referenceUrls != null) {
            for (String referenceUrl : this.referenceUrls) {
                try {
                    URL url = new URL(referenceUrl);
                } catch (MalformedURLException e) {
                    if (!this.getErrors().contains("All References must be valid URLs")) {
                        this.getErrors().add("All References must be valid URLs");
                    }
                }
            }
        }
    }
}
