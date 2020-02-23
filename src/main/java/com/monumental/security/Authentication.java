package com.monumental.security;

/**
 * This class holds SpEL constants for usage in @PreAuthorize annotations for controller methods
 * Ex: @PreAuthorize(Authentication) will restrict an endpoint to logged in users
 */
public class Authentication {

    public static final String isAuthenticated = "isAuthenticated()";
}
