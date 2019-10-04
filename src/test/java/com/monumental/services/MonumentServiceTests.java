package com.monumental.services;

import com.monumental.models.Monument;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class MonumentServiceTests {

    @Mock
    private SessionFactory sessionFactory;

    @Mock
    private SessionFactoryService sessionFactoryService;

    @Mock
    private Session session;

    @Mock
    private Transaction transaction;

    private Monument monument1;
    private Monument monument2;
    private Monument monument3;

    private List<Monument> monuments;

    private MonumentService monumentService;

    /**
     * Setup method that is run before tests are executed
     */
    @Before
    public void setUp() {
        // Setup MonumentService for tests
        this.monumentService = new MonumentService(this.sessionFactoryService);

        // Setup SessionFactoryService mock
        when(this.sessionFactoryService.getFactory()).thenReturn(this.sessionFactory);
        when(this.sessionFactoryService.getFactory().openSession()).thenReturn(this.session);

        // Setup Session mock
        when(this.session.beginTransaction()).thenReturn(this.transaction);
        when(this.session.save(this.monument1)).thenReturn(1);
        when(this.session.save(this.monument2)).thenReturn(2);
        when(this.session.save(this.monument3)).thenReturn(3);

        // Setup Monument objects for tests
        this.monument1 = new Monument();
        this.monument2 = new Monument();
        this.monument3 = new Monument();

        this.monuments = new ArrayList<>();
        this.monuments.add(this.monument1);
        this.monuments.add(this.monument2);
        this.monuments.add(this.monument3);
    }

    /**
     * Test method for unit testing MonumentService.insert(record)
     * Mocks the appropriate classes as to not connect to the database
     */
    @Test
    public void unitTestMonumentServiceInsert_Single() {
        int result = this.monumentService.insert(this.monument1);
        assertEquals(result, 1);
    }
}
