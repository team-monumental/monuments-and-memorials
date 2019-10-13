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

import static org.junit.Assert.*;

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
        ArrayList<Monument> monuments = makeMonuments();

        this.monumentService.insert(monuments);

        ArrayList<Integer> idsToGet = new ArrayList<>();
        idsToGet.add(1);
        idsToGet.add(3);

        List<Monument> results = this.monumentService.getAll(idsToGet);

        assertEquals(results.size(), 2);

        for (Monument result : results) {
            if (result.getId() == 1) {
                assertEquals(monuments.get(1).getTitle(), result.getTitle());
                assertEquals(monuments.get(1).getArtist(), result.getArtist());
            }
            else {
                assertEquals(monuments.get(3).getTitle(), result.getTitle());
                assertEquals(monuments.get(3).getArtist(), result.getArtist());
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
        ArrayList<Monument> monuments = makeMonuments();

        this.monumentService.insert(monuments);

        List<Monument> results = this.monumentService.getAll(null);

        assertEquals(results.size(), 3);

        for (Monument result : results) {
            if (result.getId() == 1) {
                assertEquals(monuments.get(1).getTitle(), result.getTitle());
                assertEquals(monuments.get(1).getArtist(), result.getArtist());
            }
            else if (result.getId() == 2) {
                assertEquals(monuments.get(2).getTitle(), result.getTitle());
                assertEquals(monuments.get(2).getArtist(), result.getArtist());
            }
            else {
                assertEquals(monuments.get(3).getTitle(), result.getTitle());
                assertEquals(monuments.get(3).getArtist(), result.getArtist());
            }
        }
    }

    // TODO: clarify what "update" actually does
    @Test
    public void testMonumentService_Update_SingleRecord() {
        Monument monument = new Monument();
        monument.setTitle("Monument 1");
        monument.setArtist("Artist 1");

        Integer id = this.monumentService.insert(monument);

        Monument monument2 = new Monument();
        monument.setTitle("Monument 1");
        monument.setArtist("Artist 2");

        this.monumentService.update(monument2);

        Monument result = this.monumentService.get(id);

        assertEquals(monument2.getTitle(), result.getTitle());
        assertEquals(monument2.getArtist(), result.getArtist());
    }

    // TODO: Needs fixing
    @Test
    public void testMonumentService_Update_MultipleRecords() {
        ArrayList<Monument> monuments = makeMonuments();
        this.monumentService.insert(monuments);

        Monument monument1 = new Monument();
        monument1.setTitle("Monument 1");
        monument1.setArtist("Artist 2");

        Monument monument2 = new Monument();
        monument2.setTitle("Monument 2");
        monument2.setArtist("Artist 3");

        ArrayList<Integer> monuments_to_update = new ArrayList<Integer>();
        monuments_to_update.add(1);
        monuments_to_update.add(2);

        this.monumentService.update(monuments_to_update);

        List<Monument> results = this.monumentService.getAll(null);

        Monument result = this.monumentService.get(id);

        assertEquals(monument2.getTitle(), result.getTitle());
        assertEquals(monument2.getArtist(), result.getArtist());
    }

    /**
     * Test method for integration testing MonumentService.delete(Integer)
     * First inserts 3 records into the database then performs a delete of a single monument ID
     * After deleting, perform a getAll, check that only 2 records are returned and that they
     * have the expected attributes
     * Uses an H2 in-memory database as to not ruin the actual database
     */
    @Test
    public void testMonumentService_Delete_SingleID() {
        ArrayList<Monument> monuments = makeMonuments();

        this.monumentService.insert(monuments);

        assertEquals(this.monumentService.getAll().size(), 3);

        this.monumentService.delete(1);

        assertEquals(this.monumentService.getAll().size(), 2);

        for (Monument result : this.monumentService.getAll()) {
            if (result.getId() == 2) {
                assertEquals(monuments.get(2).getTitle(), result.getTitle());
                assertEquals(monuments.get(2).getArtist(), result.getArtist());
            }
            else if (result.getId() == 3) {
                assertEquals(monuments.get(3).getTitle(), result.getTitle());
                assertEquals(monuments.get(3).getArtist(), result.getArtist());
            }
            else {
                fail("There is an unknown monument in the monument database. Monument as followed : " +
                result.toString());
            }
        }
    }

    /**
     * Test method for integration testing MonumentService.delete(List<record>)
     * First inserts 3 records into the database then performs a delete of an arraylist of IDs
     * After deleting, perform a getAll, check that only 1 records are returned and that they
     * have the expected attributes
     * Uses an H2 in-memory database as to not ruin the actual database
     */
    @Test
    public void testMonumentService_Delete_MultipleIDs() {
        ArrayList<Monument> monuments = makeMonuments();

        this.monumentService.insert(monuments);

        assertEquals(this.monumentService.getAll().size(), 3);

        ArrayList<Integer> IDs_to_delete = new ArrayList<Integer>();
        IDs_to_delete.add(1);
        IDs_to_delete.add(2);

        this.monumentService.delete(IDs_to_delete);

        assertEquals(this.monumentService.getAll().size(), 1);

        for (Monument result : this.monumentService.getAll()) {
            if (result.getId() == 3) {
                assertEquals(monuments.get(3).getTitle(), result.getTitle());
                assertEquals(monuments.get(3).getArtist(), result.getArtist());
            }
            else {
                fail("There is an unknown monument in the monument database. Monument as followed : " +
                        result.toString());
            }
        }
    }

    //////////////////////////////////////////////////////////
    //           Private helper functions
    //////////////////////////////////////////////////////////

    private ArrayList<Monument> makeMonuments() {
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

        return monuments;
    }
}
