package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Model class for a Tag
 * Contains all of the state related to a Tag and Getters and Setters for that state
 * Contains a many-to-many relationship with Monument
 */

@Entity
public class Tag extends Model implements Serializable {

    @Column(name = "name")
    @NotNull(groups = {New.class, Existing.class}, message = "Name can not be null")
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "tag", cascade = CascadeType.ALL)
    private Set<MonumentTag> monumentTags;

    @Column(name = "is_material")
    private Boolean isMaterial;

    /**
     * IMPORTANT NOTE: In order to avoid duplicate Tags and create a correct Monument-to-Tag relationship,
     * use TagService.createTag() instead of using this constructor
     */
    public Tag() {
        this.setMonuments(new ArrayList<>());
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<MonumentTag> getMonumentTags() {
        return this.monumentTags;
    }

    public void setMonumentTags(Set<MonumentTag> monumentTags) {
        this.monumentTags = monumentTags;
    }

    @JsonIgnore
    public List<Monument> getMonuments() {
        if (this.monumentTags == null) {
            return null;
        }

        List<Monument> monuments = new ArrayList<>();
        for (MonumentTag monumentTag : this.monumentTags) {
            monuments.add(monumentTag.getMonument());
        }

        return monuments;
    }

    @JsonIgnore
    public void setMonuments(List<Monument> monuments) {
        List<MonumentTag> monumentTags = new ArrayList<>();

        for (Monument monument : monuments) {
            monumentTags.add(new MonumentTag(monument, this));
        }

        this.monumentTags = new HashSet<>(monumentTags);
    }

    public Boolean getIsMaterial() {
        return this.isMaterial;
    }

    public void setIsMaterial(Boolean isMaterial) {
        this.isMaterial = isMaterial;
    }

    /**
     * Associates a specified Monument with this Tag
     * Will do nothing if the specified Monument is null
     * Note that this only creates an association in-memory
     * The association still needs to be persisted to the database
     *
     * @param monument - Monument to associate with this Tag
     */
    public void addMonument(Monument monument) {
        if (this.monumentTags == null) {
            this.monumentTags = new HashSet<>();
        }

        if (monument == null) {
            return;
        }

        this.monumentTags.add(new MonumentTag(monument, this));
    }
}
