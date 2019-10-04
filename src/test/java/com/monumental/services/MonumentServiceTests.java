package com.monumental.services;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class MonumentServiceTests {

    @Autowired
    MonumentService monumentService;

    /**
     * Test method for unit testing MonumentService CRUD
     * Makes use of single and many insert, get, update and delete methods
     * Mocks a connection to the database for Hibernate
     */
    @Test
    public void unitTestMonumentServiceCRUD() {

    }
}
