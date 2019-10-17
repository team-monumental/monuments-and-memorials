package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

/**
 * Model class for a Tag
 * Contains all of the state related to a Tag and Getters and Setters for that state
 * Contains a many-to-many relationship with Monument
 */

@Entity
@Table(name = "tag", uniqueConstraints = {
        @UniqueConstraint(columnNames = "id")
})
public class Tag extends Model implements Serializable {

    @Column(name = "name")
    private String name;

    @JsonIgnore
    @ManyToMany(mappedBy = "tags")
    private Set<Monument> monuments;

    public Tag() {

    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Monument> getMonuments() {
        return this.monuments;
    }

    public void setMonuments(Set<Monument> monuments) {
        this.monuments = monuments;
    }
}
