package com.monumental.models;

import org.springframework.data.jpa.domain.AbstractAuditable;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

@MappedSuperclass
public abstract class Model extends AbstractAuditable<User, Integer> {

    /* Bean Validation Groups */

    // Use this group to signify validation that occurs on record creation
    public interface New {

    }

    // Use this group to signify validation that occurs after record creation
    public interface Existing {

    }

    @AttributeOverride(name = "id", column = @Column(name="id"))
    @Null(groups = New.class, message = "ID can not be specified on insert")
    @NotNull(groups = Existing.class, message = "ID can not be null on update")
    private Integer id;

    @Override
    public Integer getId() {
        return id;
    }

    // This is overridden to be public so that tests can manipulate this
    @Override
    public void setId(Integer id) {
        this.id = id;
    }
}
