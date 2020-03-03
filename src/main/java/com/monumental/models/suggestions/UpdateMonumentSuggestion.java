package com.monumental.models.suggestions;

import com.monumental.models.Monument;

import javax.persistence.*;

/**
 * Class used to represent a suggestion to update an existing Monument record
 */
@Entity
public class UpdateMonumentSuggestion extends MonumentSuggestion {

    @ManyToOne
    @JoinColumn(name = "monument_id", nullable = false)
    private Monument monument;

    @Column(name = "json")
    private String json;

    public UpdateMonumentSuggestion() {

    }

    public Monument getMonument() {
        return this.monument;
    }

    public void setMonument(Monument monument) {
        this.monument = monument;
    }

    public String getJson() {
        return this.json;
    }

    public void setJson(String json) {
        this.json = json;
    }
}
