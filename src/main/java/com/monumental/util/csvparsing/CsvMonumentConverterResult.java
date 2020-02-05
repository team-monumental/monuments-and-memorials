package com.monumental.util.csvparsing;

import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.util.string.StringHelper;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

/**
 * Class used to encapsulate a result of calling CsvMonumentConverter.convertCsvRowToMonument
 */
public class CsvMonumentConverterResult {

    private Monument monument;

    private Set<String> tagNames = new HashSet<>();

    private List<String> materialNames = new ArrayList<>();

    private List<String> errors = new ArrayList<>();

    private List<String> warnings = new ArrayList<>();

    public Monument getMonument() {
        return this.monument;
    }

    public void setMonument(Monument monument) {
        this.monument = monument;
    }

    public Set<String> getTagNames() {
        return this.tagNames;
    }

    public void setTagNames(Set<String> tagNames) {
        this.tagNames = tagNames;
    }

    public List<String> getMaterialNames() {
        return this.materialNames;
    }

    public void setMaterialNames(List<String> materialNames) {
        this.materialNames = materialNames;
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
        if (this.monument == null) {
            this.getErrors().add("Monument can not be null");
        }

        /* Title Validation */
        /* Title is a required field */
        if (isNullOrEmpty(this.monument.getTitle())) {
            this.getErrors().add("Title is required");
        }

        /* Materials Validation */
        /* Materials is a required field */
        if (this.getMaterialNames() == null || this.getMaterialNames().size() == 0) {
            this.getErrors().add("At least one Material is required");
        }

        /* Address or Coordinates Validation */
        /* An Address OR Coordinates must be specified */
        if (isNullOrEmpty(this.monument.getAddress()) && this.monument.getCoordinates() == null) {
            this.getErrors().add("Address OR Coordinates are required");
        }

        /* Latitude Validation */
        /* Check that the latitude is within a valid range and formatted correctly */
        if (isNullOrEmpty(this.monument.getAddress()) && this.monument.getCoordinates() != null) {
            String latitudeString = this.monument.getLat().toString();
            if (!latitudeString.matches(StringHelper.latitudeRegex)) {
                this.getErrors().add("Latitude must be valid");
            }
        }

        /* Longitude Validation */
        /* Check that the longitude is within a valid range and formatted correctly */
        if (isNullOrEmpty(this.monument.getAddress()) && this.monument.getCoordinates() != null) {
            String longitudeString = this.monument.getLon().toString();
            if (!longitudeString.matches(StringHelper.longitudeRegex)) {
                this.getErrors().add("Longitude must be valid");
            }
        }

        /* Date Validation */
        /* Check that date is not in the future */
        if (this.monument.getDate() != null) {
            Date currentDate = new Date();
            if (this.monument.getDate().after(currentDate)) {
                this.getWarnings().add("Date should not be in the future.");
            }
        }

        /* References Validation */
        /* Check that the references are valid URLs */
        if (this.monument.getReferences() != null) {
            for (Reference reference : this.monument.getReferences())   {
                try {
                    URL url = new URL(reference.getUrl());
                } catch (MalformedURLException e) {
                    if (!this.getErrors().contains("All References must be valid URLs")) {
                        this.getErrors().add("All References must be valid URLs");
                    }
                }
            }
        }
    }
}
