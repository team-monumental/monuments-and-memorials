package com.monumental.models.entitymodels;

import com.monumental.models.Contribution;
import com.monumental.models.Image;
import com.monumental.models.Reference;
import com.monumental.models.Tag;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Class to represent a Monument that has not yet been validated
 * Has all the same state Monument does
 * The intended use of this class is allow for validation and de-duplication of fields before converting to Monument
 * objects and persisting to the database
 * This class can be used as our view-model as well as used by other inputs such as CSV parsing or an API endpoint
 */
public class MonumentEntity {

    private String artist;

    private String title;

    private Date date;

    private String material;

    private Double lat;

    private Double lon;

    private String city;

    private String state;

    private String address;

    private String description;

    private String inscription;

    private List<Tag> tags;

    private List<Image> images;

    private List<Contribution> contributions;

    private List<Reference> references;

    /**
     * Public constructor for MonumentEntity
     */
    public MonumentEntity() {

    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInscription() {
        return inscription;
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
        return images;
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
