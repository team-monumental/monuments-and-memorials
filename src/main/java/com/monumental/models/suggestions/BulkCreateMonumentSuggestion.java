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
 * Class used to represent a suggestion for bulk-creating Monument records
 */
@Entity
public class BulkCreateMonumentSuggestion extends MonumentSuggestion {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToMany(mappedBy = "bulkCreateSuggestion", cascade = CascadeType.ALL)
    private List<CreateMonumentSuggestion> createSuggestions;

    @Column(name = "file_name")
    @NotNull(groups = {New.class, Existing.class}, message = "Filename can not be null")
    private String fileName;

    public BulkCreateMonumentSuggestion() {
        this.createSuggestions = new ArrayList<>();
    }

    public List<CreateMonumentSuggestion> getCreateSuggestions() {
        return this.createSuggestions;
    }

    public void setCreateSuggestions(List<CreateMonumentSuggestion> createSuggestions) {
        this.createSuggestions = createSuggestions;
    }

    public String getFileName() {
        return this.fileName;
    }

    public void setFileName(String filename) {
        this.fileName = filename;
    }

    @Override
    public void setIsApproved(Boolean isApproved) {
        for (CreateMonumentSuggestion createSuggestion : this.createSuggestions) {
            createSuggestion.setIsApproved(isApproved);
        }

        super.setIsApproved(isApproved);
    }

    @Override
    public void setIsRejected(Boolean isRejected) {
        for (CreateMonumentSuggestion createSuggestion : this.createSuggestions) {
            createSuggestion.setIsRejected(isRejected);
        }

        super.setIsRejected(isRejected);
    }
}
