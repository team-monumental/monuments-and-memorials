package com.monumental.security;

public enum Role {
    COLLABORATOR,
    PARTNER,
    RESEARCHER,
    ADMIN;

    public static Role[] PARTNER_OR_ABOVE = new Role[]{PARTNER, RESEARCHER, ADMIN};
}
