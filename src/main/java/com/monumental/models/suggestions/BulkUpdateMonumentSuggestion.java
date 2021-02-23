package com.monumental.models.suggestions;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * Class used to represent a suggestion for bulk-updating Monument records
 */
@Entity
public class BulkUpdateMonumentSuggestion extends MonumentSuggestion {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToMany(mappedBy = "bulkUpdateSuggestion", cascade = CascadeType.ALL)
    private List<UpdateMonumentSuggestion> updateSuggestions;

    @Column(name = "file_name")
    @NotNull(groups = {New.class, Existing.class}, message = "Filename can not be null")
    private String fileName;

    public BulkUpdateMonumentSuggestion() { this.updateSuggestions = new ArrayList<>(); }

    public List<UpdateMonumentSuggestion> getUpdateSuggestions() { return this.updateSuggestions; }

    public void setUpdateSuggestions(List<UpdateMonumentSuggestion> updateSuggestions) {
        this.updateSuggestions = updateSuggestions;
    }

    public String getFileName() { return this.fileName; }

    public void setFileName(String filename) { this.fileName = filename; }

    @Override
    public void setIsApproved(Boolean isApproved) {
        for (UpdateMonumentSuggestion updateSuggestion : this.updateSuggestions) {
            updateSuggestion.setIsApproved(isApproved);
        }

        super.setIsApproved(isApproved);
    }

    @Override
    public void setIsRejected(Boolean isRejected) {
        for (UpdateMonumentSuggestion updateSuggestion : this.updateSuggestions) {
            updateSuggestion.setIsRejected(isRejected);
        }

        super.setIsRejected(isRejected);
    }

}
