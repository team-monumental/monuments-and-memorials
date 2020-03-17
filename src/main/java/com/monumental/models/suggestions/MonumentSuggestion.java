package com.monumental.models.suggestions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.monumental.models.Model;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import java.util.List;
import java.util.Map;

@MappedSuperclass
public abstract class MonumentSuggestion extends Model {

    @Column(name = "is_approved")
    private
    Boolean isApproved = false;

    @Column(name = "is_rejected")
    private Boolean isRejected = false;

    @JsonIgnore
    @Transient
    private Gson gson;

    public Boolean getIsApproved() {
        return this.isApproved;
    }

    public void setIsApproved(Boolean isApproved) {
        this.isApproved = isApproved;

        if (isApproved) {
            this.isRejected = false;
        }
    }

    public Boolean getIsRejected() {
        return this.isRejected;
    }

    public void setIsRejected(Boolean isRejected) {
        this.isRejected = isRejected;

        if (isRejected) {
            this.isApproved = false;
        }
    }

    List<String> deserializeStringList(String json) {
        if (json == null) {
            return null;
        }

        if (this.gson == null) {
            this.gson = new Gson();
        }

        return this.gson.fromJson(json, new TypeToken<List<String>>(){}.getType());
    }

    List<Integer> deserializeIntegerList(String json) {
        if (json == null) {
            return null;
        }

        if (this.gson == null) {
            this.gson = new Gson();
        }

        return this.gson.fromJson(json, new TypeToken<List<Integer>>(){}.getType());
    }

    Map<Integer, String> deserializeMap(String json) {
        if (json == null) {
            return null;
        }

        if (this.gson == null) {
            this.gson = new Gson();
        }

        return this.gson.fromJson(json, new TypeToken<Map<Integer, String>>(){}.getType());
    }
}
