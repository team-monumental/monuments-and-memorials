package com.monumental.models;

import javax.persistence.*;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Model class for both Monuments and Memorials
 * The name Monument is chosen for simplicity as monuments and memorials have no difference within the system
 * Contains all of the state for a Monument as well as Setters and Getters for the state
 */

@Entity
@Table(name = "monument", uniqueConstraints = {
    @UniqueConstraint(columnNames = "id")
})
public class Monument extends Model implements Serializable {

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
    private Double lat;

    @Column(name = "lon")
    private Double lon;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;
  
    @Column(name = "address")
    private String address;

    @Column(name = "description")
    private String description;

    @Column(name = "inscription")
    private String inscription;

    @ManyToMany(cascade = { CascadeType.ALL })
    @JoinTable(
            name = "monument_tag",
            joinColumns = { @JoinColumn(name = "monument_id", referencedColumnName = "id") },
            inverseJoinColumns = { @JoinColumn(name = "tag_id", referencedColumnName = "id") }
    )
    private List<Tag> tags;

    @OneToMany(mappedBy = "monument")
    private List<Image> images;

    @OneToMany(mappedBy = "monument")
    private List<Contribution> contributions;

    @OneToMany(mappedBy = "monument")
    private List<Reference> references;

    public Monument() {

    }

    public Monument(String artist, String title, Date date, String material, double lat,
                    double lon, String city, String state) {
        this.artist = artist;
        this.title = title;
        this.date = date;
        this.material = material;
        this.lat = lat;
        this.lon = lon;
        this.city = city;
        this.state = state;
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

    public Double getLat() {
        return this.lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return this.lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    public String getCoordinatePointAsString() {
        if (this.lat == null || this.lon == null ) return "";
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
  
    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return (this.description == null)
                ? this.generateDescription()
                : this.description;
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

    public List<Tag> getTags() {
        return this.tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Image> getImages() {
        return this.images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<Contribution> getContributions() {
        return this.contributions;
    }

    public void setContributions(List<Contribution> contributions) {
        this.contributions = contributions;
    }

    public List<Reference> getReferences() {
        return this.references;
    }

    public void setReferences(List<Reference> references) {
        this.references = references;
    }

    public String toString() {
        return "Artist: " + this.artist + ", Title: " + this.title + ", Date: "
                + this.date + ", Material: " + this.material + ", Coordinates: " + this.getCoordinatePointAsString()
                + ", City: " + this.city + ", State: " + this.state + ", Address: " + this.address +", Description: "
                + this.description;
    }

    /**
     * Generates a description of this Monument based on some of its state
     * @return String - the description of this Monument
     */
    private String generateDescription() {
        String description = "";

        if (!this.title.toLowerCase().startsWith("the ")) {
            description += "The ";
        }

        description += this.title + " in " + this.city + ", " + this.state + " was created by " + this.artist + " in ";

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy");

        description += simpleDateFormat.format(this.date) + ".";

        Reference firstReference = this.references.get(0);

        if (firstReference != null) {
            description += " You may find further information about this monument at: " + firstReference.getUrl();
        }

        return description;
    }
}
