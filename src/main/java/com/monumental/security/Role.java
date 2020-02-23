package com.monumental.security;

public enum Role {
    COLLABORATOR,
    PARTNER,
    RESEARCHER;

    public static Role[] PARTNER_OR_RESEARCHER = new Role[]{PARTNER, RESEARCHER};
}
