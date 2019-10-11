package com.monumental.services;

import com.monumental.models.Monument;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

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

    @Mock
    private Query getListQuery;

    @Mock
    private Query getAllQuery;

    private Monument monument1;
    private Monument monument2;
    private Monument monument3;

    private List<Monument> monuments;
    private List<Integer> ids;

    private MonumentService monumentService;

    /**
     * Setup method that is run before tests are executed
     * Sets up the various variables and mocks used during the tests
     */
    @Before
    public void setUp() {
        // Setup MonumentService for tests
        this.monumentService = new MonumentService(this.sessionFactoryService);

        // Setup Monument objects for tests
        this.monument1 = new Monument();
        this.monument1.setTitle("Monument");

        this.monument2 = new Monument();
        this.monument2.setTitle("Monument");

        this.monument3 = new Monument();
        this.monument3.setTitle("Monument");

        this.monuments = new ArrayList<>();
        this.monuments.add(this.monument1);
        this.monuments.add(this.monument2);
        this.monuments.add(this.monument3);

        this.ids = new ArrayList<>();
        this.ids.add(1);
        this.ids.add(2);
        this.ids.add(3);

        // Setup SessionFactoryService mock
        when(this.sessionFactoryService.getFactory()).thenReturn(this.sessionFactory);
        when(this.sessionFactoryService.getFactory().openSession()).thenReturn(this.session);

        // Setup Session mock
        when(this.session.beginTransaction()).thenReturn(this.transaction);

        when(this.session.save(this.monument1)).thenReturn(1);
        when(this.session.save(this.monument2)).thenReturn(2);
        when(this.session.save(this.monument3)).thenReturn(3);

        when(this.session.get(Monument.class, 1)).thenReturn(this.monument1);

        when(this.session.createQuery("FROM com.monumental.models.Monument")).thenReturn(this.getAllQuery);
        when(this.session.createQuery("FROM com.monumental.models.Monument WHERE id IN (:ids)")).thenReturn(this.getListQuery);

        // Setup Get List Query mock
        when(this.getListQuery.setParameter("ids", this.ids)).thenReturn(this.getListQuery);
        when(this.getListQuery.list()).thenReturn(this.monuments);

        // Setup Get All Query mock
        when(this.getAllQuery.list()).thenReturn(this.monuments);
    }

    /**
     * Test method for unit testing MonumentService.insert(record)
     * Mocks the appropriate classes as to not connect to the database
     */
    @Test
    public void unitTestMonumentServiceInsert_Single() {
        int result = this.monumentService.insert(this.monument1);

        assertEquals(1, result);
    }

    /**
     * Test method for unit testing MonumentService.insert(List<record>)
     * Mocks the appropriate classes as to not connect to the database
     */
    @Test
    public void unitTestMonumentServiceInsert_Multiple() {
        List<Integer> results = this.monumentService.insert(this.monuments);

        assertEquals(3, results.size());

        Integer result1 = results.get(0);
        Integer result2 = results.get(1);
        Integer result3 = results.get(2);

        assertEquals((Integer) 1, result1);
        assertEquals((Integer) 2, result2);
        assertEquals((Integer) 3, result3);
    }

    /**
     * Test method for unit testing MonumentService.get(record)
     * Mocks the appropriate classes as to not connect to the database
     */
    @Test
    public void unitTestMonumentServiceGet_Single() {
        Monument result = this.monumentService.get(1);

        assertEquals(this.monument1.getTitle(), result.getTitle());
    }

    /**
     * Test method for unit testing MonumentService.get(List<record>)
     * Mocks the appropriate classes as to not connect to the database
     */
    @Test
    public void unitTestMonumentServiceGet_ListPassed() {
        List<Monument> results = this.monumentService.get(this.ids);

        assertEquals(3, results.size());

        Monument result1 = results.get(0);
        Monument result2 = results.get(1);
        Monument result3 = results.get(2);

        assertEquals(this.monument1.getTitle(), result1.getTitle());
        assertEquals(this.monument2.getTitle(), result2.getTitle());
        assertEquals(this.monument3.getTitle(), result3.getTitle());
    }

    /**
     * Test method for unit testing MonumentService.getAll()
     * Mocks the appropriate classes as to not connect to the database
     */
    @Test
    public void unitTestMonumentServiceGetAll() {
        List<Monument> results = this.monumentService.getAll();

        assertEquals(3, results.size());

        Monument result1 = results.get(0);
        Monument result2 = results.get(1);
        Monument result3 = results.get(2);

        assertEquals(this.monument1.getTitle(), result1.getTitle());
        assertEquals(this.monument2.getTitle(), result2.getTitle());
        assertEquals(this.monument3.getTitle(), result3.getTitle());
    }
}
