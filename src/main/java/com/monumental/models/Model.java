package com.monumental.models;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@MappedSuperclass
public abstract class Model {

    /* Bean Validation Groups */
    // Use this group to signify validation that occurs during record creation
    public interface New {
    }

    // Use this group to signify validation that occurs after record creation
    public interface Existing {
    }

    // Use this group specifically to signify that the field is not required in API requests
    public interface NewOrExisting extends New, Existing {
    }

    // Use this group specifically within API requests to not require data that's retrieved through other means
    public interface API {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    @NotNull(groups = {Existing.class}, message = "id")
    private Integer id;

    @Temporal(TemporalType.DATE)
    @CreationTimestamp
    @Column(name = "created_date")
    private Date createdDate;

    @Temporal(TemporalType.DATE)
    @UpdateTimestamp
    @Column(name = "updated_date")
    private Date updatedDate;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getCreatedDate() {
        return this.createdDate;
    }

    public Date getUpdatedDate() {
        return this.updatedDate;
    }
}
