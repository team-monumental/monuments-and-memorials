package com.monumental.models;

import javax.persistence.*;
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
    @NotNull(message = "Name can not be null")
    @NotEmpty
    private String name;

    @Column(name = "email", unique = true)
    @NotNull(message = "Email address can not be null")
    @NotEmpty
    private String email;

    @Column(name = "password")
    @NotNull(message = "Password can not be null")
    @NotEmpty
    private String password;

    @Column(name = "`role`")
    @NotNull(message = "Role can not be null")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "is_enabled")
    @NotNull
    private boolean isEnabled = false;

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

    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean getIsEnabled() {
        return this.isEnabled;
    }

    public void setIsEnabled(boolean isEnabled) {
        this.isEnabled = isEnabled;
    }
}
