package com.monumental.models;

import org.springframework.data.jpa.domain.AbstractAuditable;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

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
