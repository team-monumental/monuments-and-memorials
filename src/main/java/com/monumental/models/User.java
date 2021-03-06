package com.monumental.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.monumental.security.Role;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * For now, this class simply serves as the User entity for Model's createdBy and lastModifiedBy
 * TODO: Implement User model and roles system
 */
@Entity
// "user" must be escaped because it's a reserved keyword in postgres
@Table(name = "`user`")
public class User extends Model {

    @Column(name = "first_name")
    @NotNull(message = "First name can not be null")
    @NotEmpty
    private String firstName;

    @Column(name = "last_name")
    @NotNull(message = "Last name can not be null")
    @NotEmpty
    private String lastName;

    @Column(name = "email", unique = true)
    @NotNull(message = "Email address can not be null")
    @NotEmpty
    private String email;

    @JsonIgnore
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
    private boolean isEnabled = true;

    @Column(name = "is_email_verified")
    @NotNull
    private boolean isEmailVerified = false;

    @JsonIgnore
    @OneToMany(mappedBy = "submittedByUser", cascade = CascadeType.ALL)
    private List<Contribution> contributions;

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
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

    public boolean getIsEmailVerified() {
        return this.isEmailVerified;
    }

    public void setIsEmailVerified(boolean isEmailVerified) {
        this.isEmailVerified = isEmailVerified;
    }

    public List<Contribution> getContributions() {
        return this.contributions;
    }

    public void setContributions(List<Contribution> contributions) {
        this.contributions = contributions;
    }

    @Override
    public void setLastModifiedBy(User user) {
        if (!user.getId().equals(this.getId())) {
            this.lastModifiedBy = user;
        }
    }
}
