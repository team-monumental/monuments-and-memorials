package com.monumental.models.suggestions;

import com.monumental.models.Monument;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.List;
import java.util.Map;

/**
 * Class used to represent a suggestion to update an existing Monument record
 */
public class UpdateMonumentSuggestion extends MonumentSuggestion {

    @ManyToOne
    @JoinColumn(name = "monument_id", nullable = false)
    private Monument monument;

    private String newTitle;

    private String newAddress;

    private String newArtist;

    private String newDescription;

    private String newInscription;

    private Double newLatitude;

    private Double newLongitude;

    private String newYear;

    private String newMonth;

    private String newDate;

    private boolean newIsTemporary;

    private Map<Integer, String> updatedReferencesUrlsById;

    private List<String> newReferenceUrls;

    private List<Integer> deletedReferenceIds;

    private List<String> newImageUrls;

    private Integer newPrimaryImageId;

    private List<Integer> deletedImageIds;

    private List<String> newMaterials;

    private List<String> newTags;

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

    public Map<Integer, String> getUpdatedReferencesUrlsById() {
        return this.updatedReferencesUrlsById;
    }

    public void setUpdatedReferencesUrlsById(Map<Integer, String> updatedReferencesUrlsById) {
        this.updatedReferencesUrlsById = updatedReferencesUrlsById;
    }

    public List<String> getNewReferenceUrls() {
        return this.newReferenceUrls;
    }

    public void setNewReferenceUrls(List<String> newReferenceUrls) {
        this.newReferenceUrls = newReferenceUrls;
    }

    public List<Integer> getDeletedReferenceIds() {
        return this.deletedReferenceIds;
    }

    public void setDeletedReferenceIds(List<Integer> deletedReferenceIds) {
        this.deletedReferenceIds = deletedReferenceIds;
    }

    public List<String> getNewImageUrls() {
        return this.newImageUrls;
    }

    public void setNewImageUrls(List<String> newImageUrls) {
        this.newImageUrls = newImageUrls;
    }

    public Integer getNewPrimaryImageId() {
        return this.newPrimaryImageId;
    }

    public void setNewPrimaryImageId(Integer newPrimaryImageId) {
        this.newPrimaryImageId = newPrimaryImageId;
    }

    public List<Integer> getDeletedImageIds() {
        return this.deletedImageIds;
    }

    public void setDeletedImageIds(List<Integer> deletedImageIds) {
        this.deletedImageIds = deletedImageIds;
    }

    public List<String> getNewMaterials() {
        return this.newMaterials;
    }

    public void setNewMaterials(List<String> newMaterials) {
        this.newMaterials = newMaterials;
    }

    public List<String> getNewTags() {
        return this.newTags;
    }

    public void setNewTags(List<String> newTags) {
        this.newTags = newTags;
    }
}
