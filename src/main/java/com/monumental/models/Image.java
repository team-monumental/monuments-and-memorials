package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Model class for an Image
 * Contains all of the state related to an Image and Getters and Setters for that state
 * Contains a many-to-one relationship with Monument
 */

@Entity
@Table(name = "image", uniqueConstraints = {
        @UniqueConstraint(columnNames = "id")
})
public class Image extends Model implements Serializable {

    @Column(name = "url", length = 2048)
    @NotNull(groups = {New.class, Existing.class}, message = "URL can not be null")
    private String url;

    @Column(name = "is_primary")
    private boolean isPrimary = false;

    // This indicates if an image is a Google Photo Sphere, 360 degree image
    @Column(name = "is_photo_sphere")
    private boolean isPhotoSphere = false;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "monument_id", nullable = false)
    @NotNull(groups = {New.class, Existing.class}, message = "Image must have an associated Monument")
    private Monument monument;

    public Image() {

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
}
