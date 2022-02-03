package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Model class to represent a user favorite monuments
 */
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"monument_id", "user_id"})})
public class Favorite extends Model implements Serializable {

    @ManyToOne
    @JoinColumn(name = "monument_id")
    private Monument monument;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;

    public Favorite() {

    }

    public Favorite(User user, Monument monument) {
        this.user = user;
        this.monument = monument;
    }

    public Monument getMonument() {
        return this.monument;
    }

    public void setMonument(Monument monument) {
        this.monument = monument;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
