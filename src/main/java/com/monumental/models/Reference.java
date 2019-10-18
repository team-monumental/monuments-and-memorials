package com.monumental.models;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Model class for a Reference
 * Contains all of the state associated with a Reference along with Getters and Setters for that state
 */

@Entity
@Table(name = "reference", uniqueConstraints = {
        @UniqueConstraint(columnNames = "id")
})
public class Reference extends Model implements Serializable {

    @Column(name = "url", length = 500)
    @NotNull(groups = NewOrExisting.class, message = "URL can not be null")
    private String url;

    @ManyToOne
    @JoinColumn(name = "monument_id", nullable = false)
    @NotNull(groups = NewOrExisting.class, message = "Reference must have an associated Monument")
    private Monument monument;

    public Reference() {

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
