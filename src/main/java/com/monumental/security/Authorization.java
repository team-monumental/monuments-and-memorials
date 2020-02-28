package com.monumental.security;

/**
 * This class holds SpEL constants for usage in @PreAuthorize annotations for controller methods
 * Ex: @PreAuthorize(Authorization.isResearcher) will restrict an endpoint to Researchers
 */
public class Authorization {

    public static final String isCollaborator = "hasAuthority('COLLABORATOR')";
    public static final String isPartner = "hasAuthority('PARTNER')";
    public static final String isResearcher = "hasAuthority('RESEARCHER')";
    public static final String isAdmin = "hasAuthority('ADMIN')";

    public static final String isPartnerOrAbove = "hasAnyAuthority('PARTNER', 'RESEARCHER', 'ADMIN')";
    public static final String isResearcherOrAbove = "hasAnyAuthority('RESEARCHER', 'ADMIN')";
}
