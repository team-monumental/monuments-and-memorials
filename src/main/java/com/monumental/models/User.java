package com.monumental.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/**
 * For now, this class simply serves as the User entity for Model's createdBy and lastModifiedBy
 * TODO: Implement User model and roles system
 */
@Entity
// "user" must be escaped because it's a reserved keyword in postgres
@Table(name = "`user`")
public class User extends Model {

    @Column(name = "name")
    @NotNull(groups = {New.class, Existing.class}, message = "Name can not be null")
    @NotEmpty(groups = {New.class, Existing.class})
    private String name;

    @Column(name = "email", unique = true)
    @NotNull(groups = {New.class, Existing.class}, message = "Email address can not be null")
    @NotEmpty(groups = {New.class, Existing.class})
    private String email;

    @Column(name = "password")
    @NotNull(groups = {New.class, Existing.class}, message = "Password can not be null")
    @NotEmpty(groups = {New.class, Existing.class})
    private String password;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
