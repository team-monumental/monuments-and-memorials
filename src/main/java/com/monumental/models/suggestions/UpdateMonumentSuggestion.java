package com.monumental.models.suggestions;

import com.monumental.models.Monument;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * Class used to represent a suggestion to update an existing Monument record
 */
@Entity
public class UpdateMonumentSuggestion extends MonumentSuggestion {

    @ManyToOne
    @JoinColumn(name = "monument_id", nullable = false)
    private Monument monument;

    @Column(name = "new_title")
    @NotNull(groups = {New.class, Existing.class}, message = "New title can not be null")
    private String newTitle;

    @Column(name = "new_address")
    private String newAddress;

    @Column(name = "new_artist")
    private String newArtist;

    @Column(name = "new_description")
    private String newDescription;

    @Column(name = "new_inscription")
    private String newInscription;

    @Column(name = "new_latitude")
    private Double newLatitude;

    @Column(name = "new_longitude")
    private Double newLongitude;

    @Column(name = "new_year")
    private String newYear;

    @Column(name = "new_month")
    private String newMonth;

    @Column(name = "new_date")
    private String newDate;

    @Column(name = "new_is_temporary")
    private boolean newIsTemporary;

    @Column(name = "updated_reference_urls_by_id_json")
    private String updatedReferenceUrlsByIdJson;

    @Column(name = "new_reference_urls_json")
    private String newReferenceUrlsJson;

    @Column(name = "deleted_reference_ids_json")
    private String deletedReferenceIdsJson;

    @Column(name = "new_image_urls_json")
    private String newImageUrlsJson;

    @Column(name = "new_primary_image_id")
    private Integer newPrimaryImageId;

    @Column(name = "deleted_image_ids_json")
    private String deletedImageIdsJson;

    @Column(name = "new_materials_json")
    private String newMaterialsJson;

    @Column(name = "new_tags_json")
    private String newTagsJson;

    public UpdateMonumentSuggestion() {

    }

    public Monument getMonument() {
        return this.monument;
    }

    public void setMonument(Monument monument) {
        this.monument = monument;
    }

    public String getNewTitle() {
        return this.newTitle;
    }

    public void setNewTitle(String newTitle) {
        this.newTitle = newTitle;
    }

    public String getNewAddress() {
        return this.newAddress;
    }

    public void setNewAddress(String newAddress) {
        this.newAddress = newAddress;
    }

    public String getNewArtist() {
        return this.newArtist;
    }

    public void setNewArtist(String newArtist) {
        this.newArtist = newArtist;
    }

    public String getNewDescription() {
        return this.newDescription;
    }

    public void setNewDescription(String newDescription) {
        this.newDescription = newDescription;
    }

    public String getNewInscription() {
        return this.newInscription;
    }

    public void setNewInscription(String newInscription) {
        this.newInscription = newInscription;
    }

    public Double getNewLatitude() {
        return this.newLatitude;
    }

    public void setNewLatitude(Double newLatitude) {
        this.newLatitude = newLatitude;
    }

    public Double getNewLongitude() {
        return this.newLongitude;
    }

    public void setNewLongitude(Double newLongitude) {
        this.newLongitude = newLongitude;
    }

    public String getNewYear() {
        return this.newYear;
    }

    public void setNewYear(String newYear) {
        this.newYear = newYear;
    }

    public String getNewMonth() {
        return this.newMonth;
    }

    public void setNewMonth(String newMonth) {
        this.newMonth = newMonth;
    }

    public String getNewDate() {
        return this.newDate;
    }

    public void setNewDate(String newDate) {
        this.newDate = newDate;
    }

    public boolean getNewIsTemporary() {
        return this.newIsTemporary;
    }

    public void setNewIsTemporary(boolean temporary) {
        this.newIsTemporary = temporary;
    }

    public String getUpdatedReferenceUrlsByIdJson() {
        return this.updatedReferenceUrlsByIdJson;
    }

    public void setUpdatedReferenceUrlsByIdJson(String updatedReferenceUrlsByIdJson) {
        this.updatedReferenceUrlsByIdJson = updatedReferenceUrlsByIdJson;
    }

    public String getNewReferenceUrlsJson() {
        return this.newReferenceUrlsJson;
    }

    public void setNewReferenceUrlsJson(String newReferenceUrlsJson) {
        this.newReferenceUrlsJson = newReferenceUrlsJson;
    }

    public String getDeletedReferenceIdsJson() {
        return this.deletedReferenceIdsJson;
    }

    public void setDeletedReferenceIdsJson(String deletedReferenceIdsJson) {
        this.deletedReferenceIdsJson = deletedReferenceIdsJson;
    }

    public String getNewImageUrlsJson() {
        return this.newImageUrlsJson;
    }

    public void setNewImageUrlsJson(String newImageUrlsJson) {
        this.newImageUrlsJson = newImageUrlsJson;
    }

    public Integer getNewPrimaryImageId() {
        return this.newPrimaryImageId;
    }

    public void setNewPrimaryImageId(Integer newPrimaryImageId) {
        this.newPrimaryImageId = newPrimaryImageId;
    }

    public String getDeletedImageIdsJson() {
        return this.deletedImageIdsJson;
    }

    public void setDeletedImageIdsJson(String deletedImageIdsJson) {
        this.deletedImageIdsJson = deletedImageIdsJson;
    }

    public String getNewMaterialsJson() {
        return this.newMaterialsJson;
    }

    public void setNewMaterialsJson(String newMaterialsJson) {
        this.newMaterialsJson = newMaterialsJson;
    }

    public String getNewTagsJson() {
        return this.newTagsJson;
    }

    public void setNewTagsJson(String newTagsJson) {
        this.newTagsJson = newTagsJson;
    }
}
