package com.monumental.util.csvparsing;

import com.monumental.models.Contribution;
import com.monumental.models.Monument;
import com.monumental.models.Reference;
import com.monumental.models.Tag;
import com.monumental.util.string.StringHelper;

import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

/**
 * Class used to encapsulate a result of calling CsvMonumentConverter.convertCsvRowToMonument
 */
public class CsvMonumentConverterResult {

    private Monument monument;

    private List<Tag> tags;

    public CsvMonumentConverterResult() {

    }

    public Monument getMonument() {
        return this.monument;
    }

    public void setMonument(Monument monument) {
        this.monument = monument;
    }

    public List<Tag> getTags() {
        if (this.tags == null) return null;
        List<Tag> tags = new ArrayList<>();
        for (Tag tag : this.tags) {
            if (!tag.getIsMaterial()) tags.add(tag);
        }
        return tags;
    }

    public void setTags(List<Tag> tags) {
        List<Tag> materials = this.getMaterials();
        if (this.tags != null && materials != null && materials.size() > 0) {
            materials.addAll(tags);
            this.tags = materials;
        } else {
            this.tags = tags;
        }
    }

    public List<Tag> getMaterials() {
        if (this.tags == null) return null;
        List<Tag> materials = new ArrayList<>();
        for (Tag tag : this.tags) {
            if (tag.getIsMaterial()) materials.add(tag);
        }
        return materials;
    }

    public void setMaterials(List<Tag> materials) {
        List<Tag> tags = this.getTags();
        if (this.tags != null && tags != null && tags.size() > 0) {
            tags.addAll(materials);
            this.tags = tags;
        } else {
            this.tags = materials;
        }
    }

    /**
     * Add a Tag to this.tags
     * If this.tags is null, initializes it to a new ArrayList
     * @param tag - Tag to add to this.tags
     */
    public void addTag(Tag tag) {
        if (this.tags == null) {
            this.tags = new ArrayList<>();
        }

        this.tags.add(tag);
    }

    /**
     * Validates this CsvMonumentConverterResult
     * If any of the validations fail, this CsvMonumentConverterResult is considered invalid
     * @return ValidationResult - ValidationResult object representing the result of the validation
     */
    public ValidationResult validate() {
        if (this.monument == null) {
            throw new IllegalArgumentException("Monument can not be null");
        }

        List<String> validationErrors = new ArrayList<>();

        /* Title Validation */
        /* Title is a required field */
        if (isNullOrEmpty(this.monument.getTitle())) {
            validationErrors.add("Title is required");
        }

        /* Materials Validation */
        /* Materials is a required field */
        if (this.getMaterials() == null || this.getMaterials().size() == 0) {
            validationErrors.add("At least one Material is required");
        }

        /* Address or Coordinates Validation */
        /* An Address OR Coordinates must be specified */
        if (isNullOrEmpty(this.monument.getAddress()) && this.monument.getCoordinates() == null) {
            validationErrors.add("Address OR Coordinates are required");
        }

        /* Latitude Validation */
        /* Check that the latitude is within a valid range and formatted correctly */
        if (isNullOrEmpty(this.monument.getAddress()) && this.monument.getCoordinates() != null) {
            String latitudeString = this.monument.getLat().toString();
            if (!latitudeString.matches(StringHelper.latitudeRegex)) {
                validationErrors.add("Latitude must be valid");
            }
        }

        /* Longitude Validation */
        /* Check that the longitude is within a valid range and formatted correctly */
        if (isNullOrEmpty(this.monument.getAddress()) && this.monument.getCoordinates() != null) {
            String longitudeString = this.monument.getLon().toString();
            if (!longitudeString.matches(StringHelper.longitudeRegex)) {
                validationErrors.add("Longitude must be valid");
            }
        }

        /* Date Validation */
        /* Check that date is not in the future */
        if (this.monument.getDate() != null) {
            Date currentDate = new Date();
            if (this.monument.getDate().after(currentDate)) {
                validationErrors.add("Date must be valid");
            }
        }

        /* References Validation */
        /* Check that the references are valid URLs */
        if (this.monument.getReferences() != null) {
            for (Reference reference : this.monument.getReferences())   {
                try {
                    URL url = new URL(reference.getUrl());
                } catch (MalformedURLException e) {
                    if (!validationErrors.contains("All References must be valid URLs")) {
                        validationErrors.add("All References must be valid URLs");
                    }
                }
            }
        }

        ValidationResult validationResult = new ValidationResult();
        validationResult.setValidationErrors(validationErrors);

        return validationResult;
    }

    @Override
    public String toString() {
        if (this.monument == null) {
            return null;
        }

        StringBuilder stringBuilder = new StringBuilder();

        // Contributions
        if (this.monument.getContributions().size() > 0) {
            stringBuilder.append("Contributors:\n");

            for (Contribution contribution : this.monument.getContributions()) {
                stringBuilder.append("\t").append(contribution.getSubmittedBy()).append("\n");
            }
        }

        // Artist
        if (!isNullOrEmpty(this.monument.getArtist())) {
            stringBuilder.append("Artist: ").append(this.monument.getArtist()).append("\n");
        }

        // Title
        stringBuilder.append("Title: ");
        if (isNullOrEmpty(this.monument.getTitle())) {
            stringBuilder.append("<NULL>");
        }
        else {
            stringBuilder.append(this.monument.getTitle());
        }
        stringBuilder.append("\n");

        // Date
        if (this.monument.getDate() != null) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");
            stringBuilder.append("Date: ").append(simpleDateFormat.format(this.monument.getDate())).append("\n");
        }

        // Materials
        stringBuilder.append("Materials:\n");
        if (this.getMaterials() == null || this.getMaterials().size() == 0) {
            stringBuilder.append("<NULL>").append("\n");
        }
        else {
            for (Tag material : this.getMaterials()) {
                stringBuilder.append("\t").append(material.getName()).append("\n");
            }
        }

        // Inscription
        if (!isNullOrEmpty(this.monument.getInscription())) {
            stringBuilder.append("Inscription: ").append(this.monument.getInscription()).append("\n");
        }

        // Latitude
        stringBuilder.append("Latitude: ");
        if (this.getMonument().getCoordinates() == null) {
            stringBuilder.append("<NULL>");
        }
        else {
            stringBuilder.append(this.monument.getLat());
        }
        stringBuilder.append("\n");

        // Longitude
        stringBuilder.append("Longitude: ");
        if (this.getMonument().getCoordinates() == null) {
            stringBuilder.append("<NULL>");
        }
        else {
            stringBuilder.append(this.monument.getLon());
        }
        stringBuilder.append("\n");

        // City
        if (!isNullOrEmpty(this.monument.getCity())) {
            stringBuilder.append("City: ").append(this.monument.getCity()).append("\n");
        }

        // State
        if (!isNullOrEmpty(this.monument.getState())) {
            stringBuilder.append("State: ").append(this.monument.getState()).append("\n");
        }

        // Address
        stringBuilder.append("Address: ");
        if (isNullOrEmpty(this.monument.getAddress())) {
            stringBuilder.append("<NULL>");
        }
        else {
            stringBuilder.append(this.monument.getAddress());
        }
        stringBuilder.append("\n");

        // Tags
        if (this.getTags() != null && this.getTags().size() > 0) {
            stringBuilder.append("Tags:\n");
            for (Tag tag : this.getTags()) {
                stringBuilder.append("\t").append(tag.getName()).append("\n");
            }
        }

        // References
        if (this.monument.getReferences().size() > 0) {
            stringBuilder.append("References:\n");

            for (Reference reference : this.monument.getReferences()) {
                stringBuilder.append("\t").append(reference.getUrl()).append("\n");
            }
        }

        // Images
        if (this.monument.getImages().size() > 0) {
            stringBuilder.append("Number of Images: ").append(this.monument.getImages().size()).append("\n");
        }

        return stringBuilder.toString();
    }

    /**
     * Inner-class to represent the result of a call to CsvMonumentConverterResult.validate()
     */
    public static class ValidationResult {

        private List<String> validationErrors;

        /**
         * Determines if this ValidationResult is valid or not
         * A ValidationResult is valid if it has no validation errors
         * @return True if this ValidationResult is valid, false otherwise
         */
        public boolean isValid() {
            return this.validationErrors.size() == 0;
        }

        public List<String> getValidationErrors() {
            return this.validationErrors;
        }

        public void setValidationErrors(List<String> validationErrors) {
            this.validationErrors = validationErrors;
        }
    }
}
