package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.services.MonumentService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
public class MonumentServiceIntegrationTests {

    @Autowired
    private MonumentService monumentService;

    /**
     * Test method for integration testing MonumentService.insert(record)
     * Checks that the returned result from the insert is not null, meaning it was inserted correctly
     * Utilizes an H2 in-memory database as to not ruin the actual database
     */
    @Test
    public void testMonumentService_Insert_Single() {
        Monument monument = new Monument();
        monument.setTitle("Monument 1");
        monument.setArtist("Artist 1");

        Integer result = this.monumentService.insert(monument);

        assertNotNull(result);
    }

    /**
     * Test method for integration testing MonumentService.insert(List<record>)
     * Checks that the returned results from the insert are not null, meaning it was inserted correctly
     * Utilizes an H2 in-memory database as to not ruin the actual database
     */
    @Test
    public void testMonumentService_Insert_Multiple() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1.setArtist("Artist 1");

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2.setArtist("Artist 2");

        ArrayList<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);
        monuments.add(monument2);

        List<Integer> results = this.monumentService.insert(monuments);

        for (Integer result : results) {
            assertNotNull(result);
        }
    }

    /**
     * Test method for integration testing MonumentService.get(record)
     * First inserts a record into the database then performs a get to verify the records are the same
     * Uses an H2 in-memory database as to not ruin the actual database
     */
    @Test
    public void testMonumentService_Get_Single() {
        Monument monument = new Monument();
        monument.setTitle("Monument 1");
        monument.setArtist("Artist 1");

        Integer id = this.monumentService.insert(monument);

        Monument result = this.monumentService.get(id);

        assertEquals(monument.getTitle(), result.getTitle());
        assertEquals(monument.getArtist(), result.getArtist());
    }

    /**
     * Test method for integration testing MonumentService.getAll(List<record>)
     * First inserts 3 records into the database then performs a getAll for only 2 of the records
     * Checks that only 2 records are returned and that they have the expected attributes
     * Uses an H2 in-memory database as to not ruin the actual database
     */
    @Test
    public void testMonumentService_GetAll_ListPassed() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1.setArtist("Artist 1");

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2.setArtist("Artist 2");

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3.setArtist("Artist 3");

        ArrayList<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);
        monuments.add(monument2);
        monuments.add(monument3);

        this.monumentService.insert(monuments);

        ArrayList<Integer> idsToGet = new ArrayList<>();
        idsToGet.add(1);
        idsToGet.add(3);

        List<Monument> results = this.monumentService.getAll(idsToGet);

        assertEquals(results.size(), 2);

        for (Monument result : results) {
            if (result.getId() == 1) {
                assertEquals(monument1.getTitle(), result.getTitle());
                assertEquals(monument1.getArtist(), result.getArtist());
            }
            else {
                assertEquals(monument3.getTitle(), result.getTitle());
                assertEquals(monument3.getArtist(), result.getArtist());
            }
        }
    }

    /**
     * Test method for integration testing MonumentService.getAll(null)
     * First inserts 3 records into the database then performs a getAll for all 3 records
     * Checks that 3 records are returned and that they have the expected attributes
     * Uses an H2 in-memory database as to not ruin the actual database
     */
    @Test
    public void testMonumentService_GetAll_NullPassed() {
        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1.setArtist("Artist 1");

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2.setArtist("Artist 2");

        Monument monument3 = new Monument();
        monument3.setTitle("Monument 3");
        monument3.setArtist("Artist 3");

        ArrayList<Monument> monuments = new ArrayList<>();
        monuments.add(monument1);
        monuments.add(monument2);
        monuments.add(monument3);

        this.monumentService.insert(monuments);

        List<Monument> results = this.monumentService.getAll(null);

        assertEquals(results.size(), 3);

        for (Monument result : results) {
            if (result.getId() == 1) {
                assertEquals(monument1.getTitle(), result.getTitle());
                assertEquals(monument1.getArtist(), result.getArtist());
            }
            else if (result.getId() == 2) {
                assertEquals(monument2.getTitle(), result.getTitle());
                assertEquals(monument2.getArtist(), result.getArtist());
            }
            else {
                assertEquals(monument3.getTitle(), result.getTitle());
                assertEquals(monument3.getArtist(), result.getArtist());
            }
        }
    }

    // TODO: Add integration test for: monumentService.update(record), monumentService.update(List<record>)
    // TODO: Add integration test for: monumentService.delete(id), monumentService.delete(List<ids>)
}
