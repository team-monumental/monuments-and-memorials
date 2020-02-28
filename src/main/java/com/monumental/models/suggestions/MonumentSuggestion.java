package com.monumental.models.suggestions;

import com.monumental.models.Model;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class MonumentSuggestion extends Model {

    @Column(name = "is_approved")
    private Boolean isApproved = false;

    @Column(name = "is_rejected")
    private Boolean isRejected = false;

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
}
