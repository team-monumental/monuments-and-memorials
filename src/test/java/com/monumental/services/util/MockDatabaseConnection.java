package com.monumental.services.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class MockDatabaseConnection {

    private Connection databaseConnection;

    public void initializeDatabaseConnection() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        this.databaseConnection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/postgres", "postgres",
                "password");
    }
}
