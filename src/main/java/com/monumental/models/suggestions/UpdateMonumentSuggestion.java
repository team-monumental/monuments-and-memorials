package com.monumental.models.suggestions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.monumental.models.DateFormat;
import com.monumental.models.Monument;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

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

    @Column(name = "new_city")
    private String newCity;

    @Column(name = "new_state")
    private String newState;

    @Column(name = "new_artist")
    private String newArtist;

    @Column(name = "new_description", length = 2048)
    private String newDescription;

    @Column(name = "new_inscription", length = 2048)
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

    @Column(name = "new_date_format")
    private DateFormat newDateFormat;

    @Column(name = "newDeactivatedYear")
    private String newDeactivatedYear;

    @Column(name = "newDeactivatedMonth")
    private String newDeactivatedMonth;

    @Column(name = "newDeactivatedDate")
    private String newDeactivatedDate;

    @Column(name = "new_deactivated_date_format")
    private DateFormat newDeactivatedDateFormat;

    @Column(name = "newDeactivatedComment")
    private String newDeactivatedComment;

    @Column(name = "new_is_temporary")
    private Boolean newIsTemporary = false;

    @Column(name = "updated_reference_urls_by_id_json", length = 1024)
    private String updatedReferenceUrlsByIdJson;

    @Transient
    @JsonIgnore
    private Map<Integer, String> updatedReferenceUrlsById;

    @Column(name = "new_reference_urls_json", length = 1024)
    private String newReferenceUrlsJson;

    @Transient
    @JsonIgnore
    private List<String> newReferenceUrls;

    @Column(name = "deleted_reference_ids_json", length = 1024)
    private String deletedReferenceIdsJson;

    @Transient
    @JsonIgnore
    private List<Integer> deletedReferenceIds;

    @Column(name = "new_image_urls_json", length = 1024)
    private String newImageUrlsJson;

    @Transient
    @JsonIgnore
    private List<String> newImageUrls;

    @Column(name = "new_primary_image_id")
    private Integer newPrimaryImageId;

    @Column(name = "deleted_image_ids_json", length = 1024)
    private String deletedImageIdsJson;

    @Transient
    @JsonIgnore
    private List<Integer> deletedImageIds;

    @Column(name = "deleted_image_urls_json", length = 1024)
    private String deletedImageUrlsJson;

    @Transient
    @JsonIgnore
    private List<String> deletedImageUrls;

    @Column(name = "new_photosphere_image_urls_json", length = 1024)
    private String newPhotoSphereImageUrlsJson;

    @Transient
    @JsonIgnore
    private List<String> newPhotoSphereImageUrls;

    @Column(name = "deleted_photosphere_image_ids_json", length = 1024)
    private String deletedPhotoSphereImageIdsJson;

    @Transient
    @JsonIgnore
    private List<Integer> deletedPhotoSphereImageIds;

    @Column(name = "deleted_photosphere_image_urls_json", length = 1024)
    private String deletedPhotoSphereImageUrlsJson;

    @Transient
    @JsonIgnore
    private List<String> deletedPhotoSphereImageUrls;

    @Column(name = "new_materials_json", length = 1024)
    private String newMaterialsJson;

    @Transient
    @JsonIgnore
    private List<String> newMaterials;

    @Column(name = "new_tags_json", length = 1024)
    private String newTagsJson;

    @Transient
    @JsonIgnore
    private List<String> newTags;

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

    public String getNewCity() {
        return this.newCity;
    }

    public void setNewCity(String newCity) {
        this.newCity = newCity;
    }

    public String getNewState() {
        return this.newState;
    }

    public void setNewState(String newState) {
        this.newState = newState;
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

    public DateFormat getNewDateFormat() {
        return newDateFormat;
    }

    public void setNewDateFormat(DateFormat newDateFormat) {
        this.newDateFormat = newDateFormat;
    }

    public DateFormat getNewDeactivatedDateFormat() {
        return newDeactivatedDateFormat;
    }

    public void setNewDeactivatedDateFormat(DateFormat newDeactivatedDateFormat) {
        this.newDeactivatedDateFormat = newDeactivatedDateFormat;
    }

    public void setNewDate(String newDate) {
        this.newDate = newDate;
    }

    public Boolean getNewIsTemporary() {
        return this.newIsTemporary;
    }

    public void setNewIsTemporary(Boolean newIsTemporary) {
        this.newIsTemporary = newIsTemporary;
    }

    public String getNewDeactivatedYear() {
        return newDeactivatedYear;
    }

    public void setNewDeactivatedYear(String newDeactivatedYear) {
        this.newDeactivatedYear = newDeactivatedYear;
    }

    public String getNewDeactivatedMonth() {
        return newDeactivatedMonth;
    }

    public void setNewDeactivatedMonth(String newDeactivatedMonth) {
        this.newDeactivatedMonth = newDeactivatedMonth;
    }

    public String getNewDeactivatedDate() {
        return newDeactivatedDate;
    }

    public void setNewDeactivatedDate(String newDeactivatedDate) {
        this.newDeactivatedDate = newDeactivatedDate;
    }

    public String getNewDeactivatedComment() {
        return newDeactivatedComment;
    }

    public void setNewDeactivatedComment(String newDeactivatedComment) {
        this.newDeactivatedComment = newDeactivatedComment;
    }

    public String getUpdatedReferenceUrlsByIdJson() {
        return this.updatedReferenceUrlsByIdJson;
    }

    public void setUpdatedReferenceUrlsByIdJson(String updatedReferenceUrlsByIdJson) {
        this.updatedReferenceUrlsByIdJson = updatedReferenceUrlsByIdJson;
    }

    public Map<Integer, String> getUpdatedReferenceUrlsById() {
        if (this.updatedReferenceUrlsById == null) {
            this.updatedReferenceUrlsById = this.deserializeMap(this.updatedReferenceUrlsByIdJson);
        }

        return this.updatedReferenceUrlsById;
    }

    public String getNewReferenceUrlsJson() {
        return this.newReferenceUrlsJson;
    }

    public void setNewReferenceUrlsJson(String newReferenceUrlsJson) {
        this.newReferenceUrlsJson = newReferenceUrlsJson;
    }

    public List<String> getNewReferenceUrls() {
        if (this.newReferenceUrls == null) {
            this.newReferenceUrls = this.deserializeStringList(this.newReferenceUrlsJson);
        }

        return this.newReferenceUrls;
    }

    public String getDeletedReferenceIdsJson() {
        return this.deletedReferenceIdsJson;
    }

    public void setDeletedReferenceIdsJson(String deletedReferenceIdsJson) {
        this.deletedReferenceIdsJson = deletedReferenceIdsJson;
    }

    public List<Integer> getDeletedReferenceIds() {
        if (this.deletedReferenceIds == null) {
            this.deletedReferenceIds = this.deserializeIntegerList(this.deletedReferenceIdsJson);
        }

        return this.deletedReferenceIds;
    }

    public String getNewImageUrlsJson() {
        return this.newImageUrlsJson;
    }

    public void setNewImageUrlsJson(String newImageUrlsJson) {
        this.newImageUrlsJson = newImageUrlsJson;
    }

    public List<String> getNewImageUrls() {
        if (this.newImageUrls == null) {
            this.newImageUrls = this.deserializeStringList(this.newImageUrlsJson);
        }

        return this.newImageUrls;
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

    public List<Integer> getDeletedImageIds() {
        if (this.deletedImageIds == null) {
            this.deletedImageIds = this.deserializeIntegerList(this.deletedImageIdsJson);
        }

        return this.deletedImageIds;
    }

    public String getDeletedImageUrlsJson() {
        return this.deletedImageUrlsJson;
    }

    public void setDeletedImageUrlsJson(String deletedImageUrlsJson) {
        this.deletedImageUrlsJson = deletedImageUrlsJson;
    }

    public List<String> getDeletedImageUrls() {
        if (this.deletedImageUrls == null) {
            this.deletedImageUrls = this.deserializeStringList(this.deletedImageUrlsJson);
        }

        return this.deletedImageUrls;
    }

    public String getNewPhotoSphereImageUrlsJson() {
        return this.newPhotoSphereImageUrlsJson;
    }

    public void setNewPhotoSphereImageUrlsJson(String newPhotoSphereImageUrlsJson) {
        this.newPhotoSphereImageUrlsJson = newPhotoSphereImageUrlsJson;
    }

    public List<String> getNewPhotoSphereImageUrls() {
        if (this.newPhotoSphereImageUrls == null) {
            this.newPhotoSphereImageUrls = this.deserializeStringList(this.newPhotoSphereImageUrlsJson);
        }

        return this.newPhotoSphereImageUrls;
    }

    public String getDeletedPhotoSphereImageIdsJson() {
        return this.deletedPhotoSphereImageIdsJson;
    }

    public void setDeletedPhotoSphereImageIdsJson(String deletedPhotoSphereImageIdsJson) {
        this.deletedPhotoSphereImageIdsJson = deletedPhotoSphereImageIdsJson;
    }

    public List<Integer> getDeletedPhotoSphereImageIds() {
        if (this.deletedPhotoSphereImageIds == null) {
            this.deletedPhotoSphereImageIds = this.deserializeIntegerList(this.deletedPhotoSphereImageIdsJson);
        }

        return this.deletedPhotoSphereImageIds;
    }

    public String getDeletedPhotoSphereImageUrlsJson() {
        return this.deletedPhotoSphereImageUrlsJson;
    }

    public void setDeletedPhotoSphereImageUrlsJson(String deletedPhotoSphereImageUrlsJson) {
        this.deletedPhotoSphereImageUrlsJson = deletedPhotoSphereImageUrlsJson;
    }

    public List<String> getDeletedPhotoSphereImageUrls() {
        if (this.deletedPhotoSphereImageUrls == null) {
            this.deletedPhotoSphereImageUrls = this.deserializeStringList(this.deletedPhotoSphereImageUrlsJson);
        }

        return this.deletedPhotoSphereImageUrls;
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
}
