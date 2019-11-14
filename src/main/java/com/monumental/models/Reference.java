package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Model class for a Reference
 * Contains all of the state associated with a Reference along with Getters and Setters for that state
 */

@Entity
public class Reference extends Model implements Serializable {

    @Column(name = "url", length = 500)
    @NotNull(groups = {New.class, Existing.class}, message = "URL can not be null")
    private String url;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "monument_id", nullable = false)
    @NotNull(groups = {New.class, Existing.class}, message = "Reference must have an associated Monument")
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
