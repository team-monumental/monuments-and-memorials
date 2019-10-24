package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Model class for a Tag
 * Contains all of the state related to a Tag and Getters and Setters for that state
 * Contains a many-to-many relationship with Monument
 */

@Entity
@Table(name = "tag", uniqueConstraints = {
        @UniqueConstraint(columnNames = "id"),
        @UniqueConstraint(columnNames = "name")
})
public class Tag extends Model implements Serializable {

    @Column(name = "name")
    @NotNull(groups = {New.class, Existing.class}, message = "Name can not be null")
    private String name;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @ManyToMany(cascade = { CascadeType.ALL })
    @JoinTable(
            name = "monument_tag",
            joinColumns = { @JoinColumn(name = "tag_id", referencedColumnName = "id") },
            inverseJoinColumns = { @JoinColumn(name = "monument_id", referencedColumnName = "id") },
            uniqueConstraints = { @UniqueConstraint(columnNames = {"tag_id", "monument_id"}) }
    )
    private List<Monument> monuments;

    public Tag() {

    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Monument> getMonuments() {
        return this.monuments;
    }

    public void setMonuments(List<Monument> monuments) {
        this.monuments = monuments;
    }

    /**
     * Adds a Monument to the List
     * Will do nothing if the specified Monument is null
     * Will make a new ArrayList if this.monuments is null
     * @param monument - Monument to add to the list
     */
    public void addMonument(Monument monument) {
        if (this.monuments == null) {
            this.monuments = new ArrayList<>();
        }

        if (monument == null) {
            return;
        }

        this.monuments.add(monument);
    }
}
