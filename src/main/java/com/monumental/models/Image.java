package com.monumental.models;

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

    @Column(name = "url")
    @NotNull(groups = NewOrExisting.class, message = "URL can not be null")
    private String url;

    @ManyToOne
    @JoinColumn(name = "monument_id", nullable = false)
    @NotNull(groups = NewOrExisting.class, message = "Image must have an associated Monument")
    private Monument monument;

    public Image() {

    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Monument getMonument() {
        return this.monument;
    }

    public void setMonument(Monument monument) {
        this.monument = monument;
    }
}
