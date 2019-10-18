package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * Model class for a Contribution
 * Contains all of the state associated with a Contribution along with Getters and Setters for that state
 */

@Entity
@Table(name = "contribution", uniqueConstraints = {
        @UniqueConstraint(columnNames = "id")
})
public class Contribution extends Model implements Serializable {

    @Column(name = "submitted_by")
    @NotNull(groups = NewOrExisting.class, message = "Submitted By can not be null")
    private String submittedBy;

    @Temporal(TemporalType.DATE)
    @Column(name = "date")
    private Date date;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "monument_id", nullable = false)
    @NotNull(groups = NewOrExisting.class, message = "Must have an associated Monument")
    private Monument monument;

    public Contribution() {

    }

    public String getSubmittedBy() {
        return this.submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public Date getDate() {
        return this.date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Monument getMonument() {
        return this.monument;
    }

    public void setMonument(Monument monument) {
        this.monument = monument;
    }
}
