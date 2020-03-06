package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.monumental.util.string.StringHelper;
import com.vividsolutions.jts.geom.Point;
import org.hibernate.LazyInitializationException;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Model class for both Monuments and Memorials
 * The name Monument is chosen for simplicity as monuments and memorials have no difference within the system
 * Contains all of the state for a Monument as well as Setters and Getters for the state
 */

@Entity
public class Monument extends Model implements Serializable {

    @Column(name = "artist")
    private String artist;

    @Column(name = "title")
    @NotNull(groups = {New.class, Existing.class}, message = "Title can not be null")
    private String title;

    @Temporal(TemporalType.DATE)
    @Column(name = "date")
    private Date date;

    @Column(name = "coordinates", columnDefinition = "geometry")
    private Point coordinates;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "address")
    private String address;

    @Column(name = "description")
    private String description;

    @Column(name = "inscription", length = 2048)
    private String inscription;

    @Column(name = "is_temporary")
    private Boolean isTemporary = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToMany(mappedBy = "monument")
    private Set<MonumentTag> monumentTags;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToMany(mappedBy = "monument", cascade = CascadeType.ALL)
    private List<Image> images;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToMany(mappedBy = "monument", cascade = CascadeType.ALL)
    private List<Reference> references;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToMany(mappedBy = "monument", cascade = CascadeType.ALL)
    private List<Contribution> contributions;

    public Monument() {
        this.monumentTags = new HashSet<>();
        this.images = new ArrayList<>();
        this.references = new ArrayList<>();
        this.contributions = new ArrayList<>();
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

    public Point getCoordinates() {
        return this.coordinates;
    }

    public void setCoordinates(Point coordinates) {
        this.coordinates = coordinates;
    }

    public Double getLat() {
        if (this.coordinates == null) {
            return null;
        }

        return this.coordinates.getY();
    }

    public Double getLon() {
        if (this.coordinates == null) {
            return null;
        }

        return this.coordinates.getX();
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

    public Boolean getIsTemporary() {
        return this.isTemporary;
    }

    public void setIsTemporary(Boolean isTemporary) {
        this.isTemporary = isTemporary;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Set<MonumentTag> getMonumentTags() {
        return this.monumentTags;
    }

    public void setMonumentTags(Set<MonumentTag> monumentTags) {
        this.monumentTags = monumentTags;
    }

    @JsonIgnore
    public List<Tag> getTags() {
        if (this.monumentTags == null) return null;

        List<Tag> tags = new ArrayList<>();
        try {
            for (MonumentTag monumentTag : this.monumentTags) {
                if (!monumentTag.getTag().getIsMaterial()) tags.add(monumentTag.getTag());
            }
        } catch (LazyInitializationException | NullPointerException e) {}
        return tags;
    }

    @JsonIgnore
    public void setTags(List<Tag> tags) {
        List<Tag> materials = this.getMaterials();
        List<MonumentTag> monumentTags = new ArrayList<>();

        if (this.monumentTags != null && materials != null && materials.size() > 0) {
            materials.addAll(tags);

            for (Tag tag : materials) {
                monumentTags.add(new MonumentTag(this, tag));
            }
        } else {
            for (Tag tag : tags) {
                monumentTags.add(new MonumentTag(this, tag));
            }
        }

        this.monumentTags = new HashSet<>(monumentTags);
    }

    @JsonIgnore
    public List<Tag> getMaterials() {
        if (this.monumentTags == null) return null;

        List<Tag> materials = new ArrayList<>();
        try {
            for (MonumentTag monumentTag : this.monumentTags) {
                if (monumentTag.getTag().getIsMaterial()) materials.add(monumentTag.getTag());
            }
        } catch (LazyInitializationException | NullPointerException e) {}
        return materials;
    }

    @JsonIgnore
    public void setMaterials(List<Tag> materials) {
        List<Tag> tags = this.getTags();
        List<MonumentTag> monumentTags = new ArrayList<>();

        if (this.monumentTags != null && tags != null && tags.size() > 0) {
            tags.addAll(materials);

            for (Tag tag : tags) {
                monumentTags.add(new MonumentTag(this, tag));
            }
        } else {
            for (Tag tag : materials) {
                monumentTags.add(new MonumentTag(this, tag));
            }
        }

        this.monumentTags = new HashSet<>(monumentTags);
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
                + this.date + ", Point: " + (this.coordinates != null ? this.coordinates.toString() : null)
                + ", City: " + this.city + ", State: " + this.state + ", Address: " + this.address +", Description: "
                + this.description;
    }

    /**
     * Generates a description of this Monument based on some of its state
     * If the Monument does not have a title, no description is generated
     * since Monuments should never have no title
     * @return String - the description of this Monument
     */
    private String generateDescription() {
        if (this.title == null) {
            return null;
        }

        String description = "";

        if (!this.title.toLowerCase().startsWith("the ")) {
            description += "The ";
        }

        description += this.title;

        if (!StringHelper.isNullOrEmpty(this.city) && !StringHelper.isNullOrEmpty(this.state)) {
            description += " in " + this.city + ", " + this.state;
        }
        else if (!StringHelper.isNullOrEmpty(this.city) && StringHelper.isNullOrEmpty(this.state)) {
            description += " in " + this.city;
        }
        else if (StringHelper.isNullOrEmpty(this.city) && !StringHelper.isNullOrEmpty(this.state)) {
            description += " in " + this.state;
        }

        if (!StringHelper.isNullOrEmpty(this.artist)) {
            description += " was created by " + this.artist;
        }

        if (this.date != null) {
            if (StringHelper.isNullOrEmpty(this.artist)) {
                description += " was created";
            }

            description += " in ";

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy");

            description += simpleDateFormat.format(this.date);
        }

        description += ".";

        /*
        TODO: This is causing some recursive issue where this query is getting spammed until the connection pool hits its limits
        try {
            if (this.references != null && this.references.size() > 0) {
                Reference firstReference = this.references.get(0);

                if (firstReference != null && firstReference.getUrl() != null) {
                    description += " You may find further information about this monument or memorial at: " +
                            firstReference.getUrl();
                }
            }
        } catch (LazyInitializationException e) {
            // TODO: Initialize References before reaching this point
        }
         */

        return description;
    }
}
