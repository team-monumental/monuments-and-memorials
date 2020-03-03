package com.monumental.models.suggestions;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

/**
 * Class used to represent a suggestion to create a new Monument record
 */
@Entity
public class CreateMonumentSuggestion extends MonumentSuggestion {

    @Column(name = "json")
    private String json;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bulk_create_suggestion_id")
    private BulkCreateMonumentSuggestion bulkCreateSuggestion;

    public CreateMonumentSuggestion() {

    }

    public String getJson() {
        return this.json;
    }

    public void setJson(String json) {
        this.json = json;
    }
}
