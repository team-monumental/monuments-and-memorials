package com.monumental.models.suggestions;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * Class used to represent a suggestion to create a new Monument record
 */
@Entity
public class CreateMonumentSuggestion extends MonumentSuggestion {

    @Column(name = "title")
    @NotNull(groups = {New.class, Existing.class}, message = "Title can not be null")
    private String title;

    @Column(name = "address")
    private String address;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "year")
    private String year;

    @Column(name = "month")
    private String month;

    @Column(name = "date")
    private String date;

    @Column(name = "artist")
    private String artist;

    @Column(name = "description")
    private String description;

    @Column(name = "inscription")
    private String inscription;

    @Column(name = "is_temporary")
    private boolean isTemporary;

    private List<String> references;

    private List<String> materials;

    private List<String> newMaterials;

    private List<String> tags;

    private List<String> newTags;

    private List<String> images;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bulk_create_suggestion_id")
    private BulkCreateMonumentSuggestion bulkCreateSuggestion;

    public CreateMonumentSuggestion() {
        this.references = new ArrayList<>();
        this.materials = new ArrayList<>();
        this.newMaterials = new ArrayList<>();
        this.tags = new ArrayList<>();
        this.newTags = new ArrayList<>();
        this.images = new ArrayList<>();
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return this.longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getYear() {
        return this.year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getMonth() {
        return this.month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getArtist() {
        return this.artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getDescription() {
        return this.description;
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

    public boolean getIsTemporary() {
        return this.isTemporary;
    }

    public void setIsTemporary(boolean isTemporary) {
        this.isTemporary = isTemporary;
    }

    public List<String> getReferences() {
        return this.references;
    }

    public void setReferences(List<String> references) {
        this.references = references;
    }

    public List<String> getMaterials() {
        return this.materials;
    }

    public void setMaterials(List<String> materials) {
        this.materials = materials;
    }

    public List<String> getNewMaterials() {
        return this.newMaterials;
    }

    public void setNewMaterials(List<String> newMaterials) {
        this.newMaterials = newMaterials;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getNewTags() {
        return this.newTags;
    }

    public void setNewTags(List<String> newTags) {
        this.newTags = newTags;
    }

    public List<String> getImages() {
        return this.images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }
}
