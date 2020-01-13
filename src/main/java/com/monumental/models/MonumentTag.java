package com.monumental.models;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

/**
 * Model class to represent the Many-to-Many relationship between a Monument and a Tag
 * Done in an explicit Entity because it allows for more control over queries, insertions, updates and deletions
 */
@Entity
public class MonumentTag extends Model implements Serializable {

    @ManyToOne
    @JoinColumn(name = "monument_id")
    private Monument monument;

    @ManyToOne
    @JoinColumn(name = "tag_id")
    private Tag tag;

    public MonumentTag(Monument monument, Tag tag) {
        this.monument = monument;
        this.tag = tag;
    }

    public Monument getMonument() {
        return this.monument;
    }

    public void setMonument(Monument monument) {
        this.monument = monument;
    }

    public Tag getTag() {
        return this.tag;
    }

    public void setTag(Tag tag) {
        this.tag = tag;
    }
}
