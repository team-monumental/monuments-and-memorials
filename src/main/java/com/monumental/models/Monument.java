package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.vividsolutions.jts.geom.Point;

import javax.persistence.*;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * Model class for both Monuments and Memorials
 * The name Monument is chosen for simplicity as monuments and memorials have no difference within the system
 * Contains all of the state for a Monument as well as Setters and Getters for the state
 */

@Entity
public class Monument extends Model implements Serializable {

    @Column(name = "artist")
    private String artist;

    @Column(name = "title")
    @NotNull(groups = {New.class, Existing.class}, message = "Title can not be null")
    private String title;

    @Temporal(TemporalType.DATE)
    @Column(name = "date")
    private Date date;

    @Column(name = "coordinates", columnDefinition = "geometry")
    private Point coordinates;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "address")
    private String address;

    @Column(name = "description")
    private String description;

    @Column(name = "inscription", length = 2048)
    private String inscription;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @ManyToMany(mappedBy = "monuments")
    private List<Tag> tags;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToMany(mappedBy = "monument", cascade = CascadeType.ALL)
    private List<Image> images;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToMany(mappedBy = "monument", cascade = CascadeType.ALL)
    private List<Reference> references;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToMany(mappedBy = "monument", cascade = CascadeType.ALL)
    private List<Contribution> contributions;

    public Monument() {
        this.tags = new ArrayList<>();
        this.images = new ArrayList<>();
        this.references = new ArrayList<>();
        this.contributions = new ArrayList<>();
    }

    public Monument(String artist, String title, Date date, String city, String state) {
        this.artist = artist;
        this.title = title;
        this.date = date;
        this.city = city;
        this.state = state;

        this.tags = new ArrayList<>();
        this.images = new ArrayList<>();
        this.references = new ArrayList<>();
        this.contributions = new ArrayList<>();
    }

    public String getArtist() {
        return this.artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDate() {
        return this.date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Point getCoordinates() {
        return this.coordinates;
    }

    public void setCoordinates(Point coordinates) {
        this.coordinates = coordinates;
    }

    public Double getLat() {
        if (this.coordinates == null) {
            return null;
        }

        return this.coordinates.getY();
    }

    public Double getLon() {
        if (this.coordinates == null) {
            return null;
        }

        return this.coordinates.getX();
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return this.state;
    }

    public void setState(String state) {
        this.state = state;
    }
  
    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return (this.description == null)
                ? this.generateDescription()
                : this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInscription() {
        return this.inscription;
    }

    public void setInscription(String inscription) {
        this.inscription = inscription;
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

    public List<Image> getImages() {
        return this.images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<Contribution> getContributions() {
        return this.contributions;
    }

    public void setContributions(List<Contribution> contributions) {
        this.contributions = contributions;
    }

    public List<Reference> getReferences() {
        return this.references;
    }

    public void setReferences(List<Reference> references) {
        this.references = references;
    }

    public String toString() {
        return "Artist: " + this.artist + ", Title: " + this.title + ", Date: "
                + this.date + ", Point: " + this.coordinates.toString()
                + ", City: " + this.city + ", State: " + this.state + ", Address: " + this.address +", Description: "
                + this.description;
    }

    /**
     * Generates a description of this Monument based on some of its state
     * @return String - the description of this Monument
     */
    private String generateDescription() {
        String description = "";

        if (!this.title.toLowerCase().startsWith("the ")) {
            description += "The ";
        }

        description += this.title + " in " + this.city + ", " + this.state + " was created by " + this.artist;

        if (this.date != null) {
            description += " in ";

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy");

            description += simpleDateFormat.format(this.date);
        }

        description += ".";

        /*
        TODO: This is causing some recursive issue where this query is getting spammed until the connection pool hits its limits
        try {
            if (this.references != null && this.references.size() > 0) {
                Reference firstReference = this.references.get(0);

                if (firstReference != null && firstReference.getUrl() != null) {
                    description += " You may find further information about this monument or memorial at: " +
                            firstReference.getUrl();
                }
            }
        } catch (LazyInitializationException e) {
            // TODO: Initialize References before reaching this point
        }
         */

        return description;
    }

    /**
     * Encapsulates the logic to validate a Monument object
     * Use this method to manually run validation in lieu of a @Valid Spring annotation
     * @param validationClass - The class grouping to validate
     * @return ValidationResult - ValidationResult object representing the result of the validation
     */
    public ValidationResult validate(Class validationClass) {
        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
        ValidationResult result = new ValidationResult();

        result.setViolations(validator.validate(this, validationClass));

        return result;
    }

    /**
     * Inner-class to represent the result of a call to Monument.validate()
     */
    public static class ValidationResult {

        private Set<ConstraintViolation<Monument>> violations;

        /**
         * Determines if this ValidationResult is valid
         * It is valid if there are no ConstraintViolation<Monument> in the Set
         * @return boolean - true if the ValidationResult is valid, false otherwise
         */
        public boolean isValid() {
            return this.violations.isEmpty();
        }

        /**
         * Returns a List of the violation messages (if there are any) as Strings
         * If there are no ConstraintViolations, returns an empty List
         * @return List<String> - List of violation messages as Strings (if there are any)
         */
        public List<String> getViolationMessages() {
            ArrayList<String> violationMessages = new ArrayList<>();

            for (ConstraintViolation<Monument> violation : this.violations) {
                violationMessages.add(violation.getMessage());
            }

            return violationMessages;
        }

        void setViolations(Set<ConstraintViolation<Monument>> violations) {
            this.violations = violations;
        }
    }
}
