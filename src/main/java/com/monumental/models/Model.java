package com.monumental.models;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.util.Date;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Model {

    /* Bean Validation Groups */

    // Use this group to signify validation that occurs on record creation
    public interface New {

    }

    // Use this group to signify validation that occurs after record creation
    public interface Existing {

    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false)
    @Null(groups = New.class, message = "ID can not be specified on insert")
    @NotNull(groups = Existing.class, message = "ID can not be null on update")
    private Integer id;

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private Date createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private Date lastModifiedDate;

    @CreatedBy
    @Column(name = "created_by_user_id")
    private Integer createdByUserId;

    @LastModifiedBy
    @Column(name = "last_modified_by_user_id")
    private Integer lastModifiedByUserId;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getCreatedDate() {
        return this.createdDate;
    }

    public Date getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public Integer getCreatedByUserId() {
        return this.createdByUserId;
    }

    public Integer getLastModifiedByUserId() {
        return this.lastModifiedByUserId;
    }
}
