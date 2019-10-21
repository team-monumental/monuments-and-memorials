package com.monumental.models;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.GroupSequence;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.util.Date;

@MappedSuperclass
public abstract class Model {

    /* Bean Validation Groups */

    // Use this group to signify validation that occurs on record creation
    public interface New {

    }

    // Use this group to signify validation that occurs after record creation
    public interface Existing {

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    @Null(groups = New.class, message = "ID can not be specified on insert")
    @NotNull(groups = Existing.class, message = "ID can not be null")
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
