package com.monumental.models;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * Model class for a Monument or Memorial
 * Contains all of the state for an M&M as well as Setters and Getters for the state
 * TODO: Determine how to store "materials" (right now just a String but the spreadsheet is a bit more complex)
 * TODO: Setup FK relationship to Tags
 * TODO: Setup FK relationship to Images
 */

@Entity
@Table(name = "mandm", uniqueConstraints = {
    @UniqueConstraint(columnNames = "id")
})
public class MandM extends Model implements Serializable {

    @Column(name = "submitted_by")
    private String submittedBy;

    @Column(name = "artist")
    private String artist;

    @Column(name = "title")
    private String title;

    @Temporal(TemporalType.DATE)
    @Column(name = "date")
    private Date date;

    @Column(name = "material")
    private String material;

    @Column(name = "north_coordinates")
    private double northCoordinates;

    @Column(name = "west_coordinates")
    private double westCoordinates;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    public MandM() {

    }

    public MandM(String submittedBy, String artist, String title, Date date, String material, double northCoordinates,
                 double westCoordinates, String city, String state) {
        this.submittedBy = submittedBy;
        this.artist = artist;
        this.title = title;
        this.date = date;
        this.material = material;
        this.northCoordinates = northCoordinates;
        this.westCoordinates = westCoordinates;
        this.city = city;
        this.state = state;
    }

    public String getSubmittedBy() {
        return this.submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public String getArtist() {
        return this.artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDate() {
        return this.date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getMaterial() {
        return this.material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public double getNorthCoordinates() {
        return this.northCoordinates;
    }

    public void setNorthCoordinates(double northCoordinates) {
        this.northCoordinates = northCoordinates;
    }

    public double getWestCoordinates() {
        return this.westCoordinates;
    }

    public void setWestCoordinates(double westCoordinates) {
        this.westCoordinates = westCoordinates;
    }

    public String getCoordinatePointAsString() {
        return Double.toString(this.northCoordinates) + ", " + Double.toString(this.westCoordinates);
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

    public String toString() {
        return "Submitted by: " + this.submittedBy +  ", Artist: " + this.artist + ", Title: " + this.title + ", Date: "
                + this.date + ", Material: " + this.material + ", Coordinates: " + this.getCoordinatePointAsString()
                + ", City: " + this.city + ", State: " + this.state;
    }
}
