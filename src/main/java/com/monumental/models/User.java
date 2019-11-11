package com.monumental.models;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * For now, this class simply serves as the required User entity for AbstractAuditable which Model extends
 * TODO: Implement User model and roles system
 */
@Entity
// "user" must be escaped because it's a reserved keyword in postgres
@Table(name = "`user`")
public class User extends Model {

}
