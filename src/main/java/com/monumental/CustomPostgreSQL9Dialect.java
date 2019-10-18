package com.monumental;

import org.hibernate.dialect.PostgreSQL9Dialect;

/**
 * This is a custom dialect used to register custom Postgres functions
 * https://www.zymr.com/postgresql-full-text-searchfts-hibernate/
 */
public class CustomPostgreSQL9Dialect extends PostgreSQL9Dialect {

    public CustomPostgreSQL9Dialect() {
        registerFunction("fts", new FTSFunction());
    }
}
