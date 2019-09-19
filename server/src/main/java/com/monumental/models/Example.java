package com.monumental.models;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "example", uniqueConstraints = {
    @UniqueConstraint(columnNames = "id")
})
public class Example implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    public Integer getId() {
        return this.id;
    }
}
