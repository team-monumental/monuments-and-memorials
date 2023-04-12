package com.monumental.models;

import com.fasterxml.jackson.annotation.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

/**
 * Model class for an Image
 * Contains all of the state related to an Image and Getters and Setters for that state
 * Contains a many-to-one relationship with Monument
 */

@Entity
public class Image extends Model implements Serializable {

    @Column(name = "url", length = 2048)
    @NotNull(groups = {New.class, Existing.class}, message = "URL can not be null")
    private String url;

    @Column(name = "is_primary")
    private boolean isPrimary = false;

    // This indicates if an image is a Google Photo Sphere, 360 degree image
    @Column(name = "is_photo_sphere")
    private boolean isPhotoSphere = false;

    @Column(name = "reference_url", length = 2048)
    private String referenceUrl = "";

    @Column(name = "caption")
    private String caption = "";

    @Column(name = "alt_text", length = 2048)
    private String altText = "";

    @JsonIdentityReference(alwaysAsId = true)
    @JsonProperty("monument_id")
    @ManyToOne
    @JoinColumn(name = "monument_id", nullable = false)
    @NotNull(groups = {New.class, Existing.class}, message = "Image must have an associated Monument")
    private Monument monument;

    public Image() {
    }

    public Image(String url, boolean isPrimary) {
        if (isNullOrEmpty(url)) {
            throw new IllegalArgumentException("URL must not be null or empty");
        }

        this.url = url;
        this.isPrimary = isPrimary;
    }

    public Image(String url, boolean isPrimary, String referenceUrl, String caption) {
        if (isNullOrEmpty(url)) {
            throw new IllegalArgumentException("URL must not be null or empty");
        }

        this.url = url;
        this.isPrimary = isPrimary;
        this.referenceUrl = referenceUrl;
        this.caption = caption;
    }

    public Image(String url, boolean isPrimary, String referenceUrl, String caption, String altText) {
        if (isNullOrEmpty(url)) {
            throw new IllegalArgumentException("URL must not be null or empty");
        }

        this.url = url;
        this.isPrimary = isPrimary;
        this.referenceUrl = referenceUrl;
        this.caption = caption;
        this.altText = altText;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean getIsPrimary() {
        return this.isPrimary;
    }

    public void setIsPrimary(boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public Monument getMonument() {
        return this.monument;
    }

    public void setMonument(Monument monument) {
        this.monument = monument;
    }

    public boolean getIsPhotoSphere() {
        return this.isPhotoSphere;
    }

    public void setIsPhotoSphere(boolean isPhotoSphere) {
        this.isPhotoSphere = isPhotoSphere;
    }

    public String getReferenceUrl() {
        return referenceUrl;
    }

    public void setReferenceUrl(String referenceUrl) {
        this.referenceUrl = referenceUrl;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

}
