package com.monumental.models;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * Model class for both Monuments and Memorials
 * The name Monument is chosen for simplicity as monuments and memorials have no difference within the system
 * Contains all of the state for a Monument as well as Setters and Getters for the state
 * TODO: Determine how to store "materials" (right now just a String but the spreadsheet is a bit more complex)
 * TODO: Setup FK relationship to Tags
 * TODO: Setup FK relationship to Images
 */

@Entity
@Table(name = "monument", uniqueConstraints = {
    @UniqueConstraint(columnNames = "id")
})
public class Monument extends Model implements Serializable {

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

    @Column(name = "lat")
    private double lat;

    @Column(name = "lon")
    private double lon;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    public Monument() {

    }

    public Monument(String submittedBy, String artist, String title, Date date, String material, double lat,
                    double lon, String city, String state) {
        this.submittedBy = submittedBy;
        this.artist = artist;
        this.title = title;
        this.date = date;
        this.material = material;
        this.lat = lat;
        this.lon = lon;
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

    public double getlat() {
        return this.lat;
    }

    public void setlat(double lat) {
        this.lat = lat;
    }

    public double getlon() {
        return this.lon;
    }

    public void setlon(double lon) {
        this.lon = lon;
    }

    public String getCoordinatePointAsString() {
        return Double.toString(this.lat) + ", " + Double.toString(this.lon);
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
