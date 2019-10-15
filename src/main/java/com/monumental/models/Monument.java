package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.LazyInitializationException;

import javax.persistence.*;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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

    @JsonIgnore
    @ManyToMany(mappedBy = "monuments")
    private List<Tag> tags;

    @JsonIgnore
    @OneToMany(mappedBy = "monument")
    private List<Image> images;

    @JsonIgnore
    @OneToMany(mappedBy = "monument")
    private List<Reference> references;

    @JsonIgnore
    @OneToMany(mappedBy = "monument")
    private List<Contribution> contributions;

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

        description += this.title + " in " + this.city + ", " + this.state + " was created by " + this.artist;

        if (this.date != null) {
            description += " in ";

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy");

            description += simpleDateFormat.format(this.date);
        }

        description += ".";

        try {
            if (this.references != null && this.references.size() > 0) {
                Reference firstReference = this.references.get(0);

                if (firstReference != null && firstReference.getUrl() != null) {
                    description += " You may find further information about this monument at: " + firstReference.getUrl();
                }
            }
        } catch (LazyInitializationException e) {
            // TODO: Initialize References before reaching this point
        }

        return description;
    }

    /**
     * Adds a Contribution to the List
     * Will make a new ArrayList if this.contributions is null
     * Checks if a Contribution has already been added to this.contributions with the same date and name
     * and does nothing if so
     * @param contribution - Contribution to add to the List
     */
    public void addContribution(Contribution contribution) {
        if (this.contributions == null) {
            this.contributions = new ArrayList<>();
        }

        for (Contribution c : this.contributions) {
            if (c.getDate() == contribution.getDate() &&
                    c.getSubmittedBy().equalsIgnoreCase(contribution.getSubmittedBy())) {
                return;
            }
        }

        this.contributions.add(contribution);
    }

    /**
     * Adds a Reference to the List
     * Will make a new ArrayList if this.references is null
     * Checks if a Reference has already been added to this.references with the same url
     * and does nothing if so
     * @param reference - Reference to add to the List
     */
    public void addReference(Reference reference) {
        if (this.references == null) {
            this.references = new ArrayList<>();
        }

        for (Reference r : this.references) {
            if (r.getUrl().equalsIgnoreCase(reference.getUrl())) {
                return;
            }
        }

        this.references.add(reference);
    }

    /**
     * Adds a Tag to the List
     * Will make a new ArrayList if this.tags is null
     * Checks if a Tag has already been added to this.references with the same name
     * and does nothing if so
     * @param tag - Tag to add to the List
     */
    public void addTag(Tag tag) {
        if (this.tags == null) {
            this.tags = new ArrayList<>();
        }

        for (Tag t : this.tags) {
            if (t.getName().equalsIgnoreCase(tag.getName())) {
                return;
            }
        }

        this.tags.add(tag);
    }
}
