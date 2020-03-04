package com.monumental.models.suggestions;

import com.google.gson.Gson;
import com.monumental.models.Model;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.util.List;
import java.util.Map;

@MappedSuperclass
public abstract class MonumentSuggestion extends Model {

    @Column(name = "is_approved")
    private Boolean isApproved = false;

    @Column(name = "is_rejected")
    private Boolean isRejected = false;

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

    protected List deserializeList(String json) {
        if (this.gson == null) {
            this.gson = new Gson();
        }

        return this.gson.fromJson(json, List.class);
    }

    protected Map deserializeMap(String json) {
        if (this.gson == null) {
            this.gson = new Gson();
        }

        return this.gson.fromJson(json, Map.class);
    }
}
