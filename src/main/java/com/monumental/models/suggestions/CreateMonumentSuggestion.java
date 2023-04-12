package com.monumental.models.suggestions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.monumental.models.DateFormat;

import javax.persistence.*;
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

    @Column(name = "date_format")
    private DateFormat dateFormat;

    @Column(name = "deactivatedYear")
    private String deactivatedYear;

    @Column(name = "deactivatedMonth")
    private String deactivatedMonth;

    @Column(name = "deactivatedDate")
    private String deactivatedDate;

    @Column(name = "deactivated_date_format")
    private DateFormat deactivatedDateFormat;

    @Column(name = "deactivatedComment", length = 2048)
    private String deactivatedComment;

    @Column(name = "artist")
    private String artist;

    @Column(name = "description", length = 2048)
    private String description;

    @Column(name = "inscription", length = 2048)
    private String inscription;

    @Column(name = "is_temporary")
    private Boolean isTemporary = false;

    @Column(name = "contributions_json", length = 1024)
    private String contributionsJson;

    @Transient
    @JsonIgnore
    private List<String> contributions;

    @Column(name = "references_json", length = 2048)
    private String referencesJson;

    @Transient
    @JsonIgnore
    private List<String> references;

    @Column(name = "materials_json", length = 1024)
    private String materialsJson;

    @Transient
    @JsonIgnore
    private List<String> materials;

    @Column(name = "new_materials_json", length = 1024)
    private String newMaterialsJson;

    @Transient
    @JsonIgnore
    private List<String> newMaterials;

    @Column(name = "tags_json", length = 1024)
    private String tagsJson;

    @Transient
    @JsonIgnore
    private List<String> tags;

    @Column(name = "new_tags_json", length = 1024)
    private String newTagsJson;

    @Transient
    @JsonIgnore
    private List<String> newTags;

    @Column(name = "images_json", length = 1024)
    private String imagesJson;

    @Transient
    @JsonIgnore
    private List<String> images;

    @Column(name = "image_reference_urls_json", length = 2048)
    private String imageReferenceUrlsJson;

    @Transient
    @JsonIgnore
    private List<String> imageReferenceUrls;

    @Column(name = "image_captions_json", length = 2048)
    private String imageCaptionsJson;

    @Transient
    @JsonIgnore
    private List<String> imageCaptions;

    @Column(name = "image_alt_texts_json", length = 2048)
    private String imageAltTextsJson;

    @Transient
    @JsonIgnore
    private List<String> imageAltTexts;

    @Column(name = "photosphere_images_json", length = 2048)
    private String photoSphereImagesJson;

    @Transient
    @JsonIgnore
    private List<String> photoSphereImages;

    @Column(name = "photosphere_image_reference_urls_json", length = 2048)
    private String photoSphereImageReferenceUrlsJson;

    @Transient
    @JsonIgnore
    private List<String> photoSphereImageReferenceUrls;

    @Column(name = "photosphere_image_captions_json", length = 2048)
    private String photoSphereImageCaptionsJson;

    @Transient
    @JsonIgnore
    private List<String> photoSphereImageCaptions;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bulk_create_suggestion_id")
    private BulkCreateMonumentSuggestion bulkCreateSuggestion;

    public CreateMonumentSuggestion() {
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

    public DateFormat getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(DateFormat dateFormat) {
        this.dateFormat = dateFormat;
    }

    public DateFormat getDeactivatedDateFormat() {
        return deactivatedDateFormat;
    }

    public void setDeactivatedDateFormat(DateFormat deactivatedDateFormat) {
        this.deactivatedDateFormat = deactivatedDateFormat;
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

    public String getDeactivatedYear() {
        return deactivatedYear;
    }

    public void setDeactivatedYear(String deactivatedYear) {
        this.deactivatedYear = deactivatedYear;
    }

    public String getDeactivatedMonth() {
        return deactivatedMonth;
    }

    public void setDeactivatedMonth(String deactivatedMonth) {
        this.deactivatedMonth = deactivatedMonth;
    }

    public String getDeactivatedDate() {
        return deactivatedDate;
    }

    public void setDeactivatedDate(String deactivatedDate) {
        this.deactivatedDate = deactivatedDate;
    }

    public String getDeactivatedComment() {
        return deactivatedComment;
    }

    public void setDeactivatedComment(String deactivatedComment) {
        this.deactivatedComment = deactivatedComment;
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
        if (this.images == null || (this.imagesJson != null && this.images.isEmpty() && !this.imagesJson.isEmpty())) {
            this.images = this.deserializeStringList(this.imagesJson);
        }

        return this.images;
    }

    public String getImageReferenceUrlsJson() {
        return imageReferenceUrlsJson;
    }

    public void setImageReferenceUrlsJson(String imageReferenceUrlsJson) {
        this.imageReferenceUrlsJson = imageReferenceUrlsJson;
    }

    public List<String> getImageReferenceUrls() throws IndexOutOfBoundsException {
        if (this.imageReferenceUrls == null || (this.imageReferenceUrlsJson != null && this.imageReferenceUrls.isEmpty() && !this.imageReferenceUrlsJson.isEmpty())) {
            this.imageReferenceUrls = this.deserializeStringList(this.imageReferenceUrlsJson);
        }

        if (this.imageReferenceUrls != null && this.getImages().size() != this.imageReferenceUrls.size()) {
            throw new IndexOutOfBoundsException("Number of image reference URLs must match number of images");
        }

        return this.imageReferenceUrls;
    }

    public String getImageCaptionsJson() {
        return imageCaptionsJson;
    }

    public void setImageCaptionsJson(String imageCaptionsJson) {
        this.imageCaptionsJson = imageCaptionsJson;
    }

    public List<String> getImageCaptions() {
        if (this.imageCaptions == null || (this.imageCaptionsJson != null && this.imageCaptions.isEmpty() && !this.imageCaptionsJson.isEmpty())) {
            this.imageCaptions = this.deserializeStringList(this.imageCaptionsJson);
        }

        if (this.imageCaptions != null && this.getImages().size() != this.imageCaptions.size()) {
            throw new IndexOutOfBoundsException("Number of image captions must match number of images");
        }

        return this.imageCaptions;
    }

    public String getImageAltTextsJson() {
        return imageAltTextsJson;
    }

    public void setImageAltTextsJson(String imageAltTextJson) {
        this.imageAltTextsJson = imageAltTextJson;
    }

    public List<String> getImageAltTexts() {
        if (this.imageAltTexts == null || (this.imageAltTextsJson != null && this.imageAltTexts.isEmpty() && !this.imageAltTextsJson.isEmpty())) {
            this.imageAltTexts = this.deserializeStringList(this.imageAltTextsJson);
        }

        if (this.imageAltTexts != null && this.getImages().size() != this.imageAltTexts.size()) {
            throw new IndexOutOfBoundsException("Number of image alt-texts must match number of images");
        }

        return imageAltTexts;
    }

    public String getPhotoSphereImagesJson() {
        return this.photoSphereImagesJson;
    }

    public void setPhotoSphereImagesJson(String photoSphereImagesJson) {
        this.photoSphereImagesJson = photoSphereImagesJson;
    }

    public List<String> getPhotoSphereImages() {
        if (this.photoSphereImages == null || (this.photoSphereImagesJson != null &&
                this.photoSphereImages.isEmpty() && !this.photoSphereImagesJson.isEmpty())) {
            this.photoSphereImages = this.deserializeStringList(this.photoSphereImagesJson);
        }

        return this.photoSphereImages;
    }

    public String getPhotoSphereImageReferenceUrlsJson() {
        return photoSphereImageReferenceUrlsJson;
    }

    public void setPhotoSphereImageReferenceUrlsJson(String photoSphereImageReferenceUrlsJson) {
        this.photoSphereImageReferenceUrlsJson = photoSphereImageReferenceUrlsJson;
    }

    public List<String> getPhotoSphereImageReferenceUrls() throws IndexOutOfBoundsException {
        if (this.photoSphereImageReferenceUrls == null || (this.photoSphereImageReferenceUrlsJson != null &&
                this.photoSphereImageReferenceUrls.isEmpty() && !this.photoSphereImageReferenceUrlsJson.isEmpty())) {
            this.photoSphereImageReferenceUrls = this.deserializeStringList(this.photoSphereImageReferenceUrlsJson);
        }

        if (this.photoSphereImageReferenceUrls != null && this.getPhotoSphereImages().size() != this.photoSphereImageReferenceUrls.size()) {
            throw new IndexOutOfBoundsException("Number of photosphere image reference URLs must match number of photosphere images");
        }

        return this.photoSphereImageReferenceUrls;
    }

    public String getPhotoSphereImageCaptionsJson() {
        return photoSphereImageCaptionsJson;
    }

    public void setPhotoSphereImageCaptionsJson(String photoSphereImageCaptionsJson) {
        this.photoSphereImageCaptionsJson = photoSphereImageCaptionsJson;
    }

    public List<String> getPhotoSphereImageCaptions() {
        if (this.photoSphereImageCaptions == null || (this.photoSphereImageCaptionsJson != null &&
                this.photoSphereImageCaptions.isEmpty() && !this.photoSphereImageCaptionsJson.isEmpty())) {
            this.photoSphereImageCaptions = this.deserializeStringList(this.photoSphereImageCaptionsJson);
        }

        if (this.photoSphereImageCaptions != null && this.getPhotoSphereImages().size() != this.photoSphereImageCaptions.size()) {
            throw new IndexOutOfBoundsException("Number of photosphere image captions must match number of photosphere images");
        }

        return this.photoSphereImageCaptions;
    }

    public BulkCreateMonumentSuggestion getBulkCreateSuggestion() {
        return this.bulkCreateSuggestion;
    }

    public void setBulkCreateSuggestion(BulkCreateMonumentSuggestion bulkCreateSuggestion) {
        this.bulkCreateSuggestion = bulkCreateSuggestion;
    }
}
