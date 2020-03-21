package com.monumental.models.suggestions;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
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

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

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
    private Boolean isTemporary = false;

    @Column(name = "contributions_json")
    private String contributionsJson;

    @Transient
    @JsonIgnore
    private List<String> contributions;

    @Column(name = "references_json")
    private String referencesJson;

    @Transient
    @JsonIgnore
    private List<String> references;

    @Column(name = "materials_json")
    private String materialsJson;

    @Transient
    @JsonIgnore
    private List<String> materials;

    @Column(name = "new_materials_json")
    private String newMaterialsJson;

    @Transient
    @JsonIgnore
    private List<String> newMaterials;

    @Column(name = "tags_json")
    private String tagsJson;

    @Transient
    @JsonIgnore
    private List<String> tags;

    @Column(name = "new_tags_json")
    private String newTagsJson;

    @Transient
    @JsonIgnore
    private List<String> newTags;

    @Column(name = "images_json")
    private String imagesJson;

    @Transient
    @JsonIgnore
    private List<String> images;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bulk_create_suggestion_id")
    private BulkCreateMonumentSuggestion bulkCreateSuggestion;

    public CreateMonumentSuggestion() {

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

    public Boolean getIsTemporary() {
        return this.isTemporary;
    }

    public void setIsTemporary(Boolean isTemporary) {
        this.isTemporary = isTemporary;
    }

    public String getContributionsJson() {
        return this.contributionsJson;
    }

    public void setContributionsJson(String contributionsJson) {
        this.contributionsJson = contributionsJson;
    }

    public List<String> getContributions() {
        if (this.contributions == null) {
            this.contributions = this.deserializeStringList(this.contributionsJson);
        }

        return this.contributions;
    }

    public String getReferencesJson() {
        return this.referencesJson;
    }

    public void setReferencesJson(String referencesJson) {
        this.referencesJson = referencesJson;
    }

    public List<String> getReferences() {
        if (this.references == null) {
            this.references = this.deserializeStringList(this.referencesJson);
        }

        return this.references;
    }

    public String getMaterialsJson() {
        return this.materialsJson;
    }

    public void setMaterialsJson(String materialsJson) {
        this.materialsJson = materialsJson;
    }

    public List<String> getMaterials() {
        if (this.materials == null) {
            this.materials = this.deserializeStringList(this.materialsJson);
        }

        return this.materials;
    }

    public String getNewMaterialsJson() {
        return this.newMaterialsJson;
    }

    public void setNewMaterialsJson(String newMaterialsJson) {
        this.newMaterialsJson = newMaterialsJson;
    }

    public List<String> getNewMaterials() {
        if (this.newMaterials == null) {
            this.newMaterials = this.deserializeStringList(this.newMaterialsJson);
        }

        return this.newMaterials;
    }

    public String getTagsJson() {
        return this.tagsJson;
    }

    public void setTagsJson(String tagsJson) {
        this.tagsJson = tagsJson;
    }

    public List<String> getTags() {
        if (this.tags == null) {
            this.tags = this.deserializeStringList(this.tagsJson);
        }

        return this.tags;
    }

    public String getNewTagsJson() {
        return this.newTagsJson;
    }

    public void setNewTagsJson(String newTagsJson) {
        this.newTagsJson = newTagsJson;
    }

    public List<String> getNewTags() {
        if (this.newTags == null) {
            this.newTags = this.deserializeStringList(this.newTagsJson);
        }

        return this.newTags;
    }

    public String getImagesJson() {
        return this.imagesJson;
    }

    public void setImagesJson(String imagesJson) {
        this.imagesJson = imagesJson;
    }

    public List<String> getImages() {
        if (this.images == null) {
            this.images = this.deserializeStringList(this.imagesJson);
        }

        return this.images;
    }

    public BulkCreateMonumentSuggestion getBulkCreateSuggestion() {
        return this.bulkCreateSuggestion;
    }

    public void setBulkCreateSuggestion(BulkCreateMonumentSuggestion bulkCreateSuggestion) {
        this.bulkCreateSuggestion = bulkCreateSuggestion;
    }
}
