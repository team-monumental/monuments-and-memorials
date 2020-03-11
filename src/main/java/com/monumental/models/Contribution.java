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
public class Contribution extends Model implements Serializable {

    // Use this when crediting people who aren't users in our system - i.e. from a bulk upload spreadsheet
    @Column(name = "submitted_by")
    private String submittedBy;

    // Use this when crediting people who ARE users in our system - i.e. after a suggestion is approved
    @ManyToOne
    @JoinColumn(name = "submitted_by_id")
    private User submittedByUser;

    @Temporal(TemporalType.DATE)
    @Column(name = "date")
    private Date date;

    @ManyToOne
    @JoinColumn(name = "monument_id", nullable = false)
    @NotNull(groups = {New.class, Existing.class}, message = "Must have an associated Monument")
    private Monument monument;

    public Contribution() {

    }

    public String getSubmittedBy() {
        return this.submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public User getSubmittedByUser() {
        return this.submittedByUser;
    }

    public void setSubmittedByUser(User submittedByUser) {
        this.submittedByUser = submittedByUser;
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
