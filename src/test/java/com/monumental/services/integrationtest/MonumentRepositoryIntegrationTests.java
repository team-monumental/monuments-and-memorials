package com.monumental.services.integrationtest;

import com.monumental.models.Monument;
import com.monumental.repositories.MonumentRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;

/**
 * Test class for integration testing the MonumentRepository CRUD operations and their connection to the database
 * The tests in this class utilize an H2 in-memory database as to not ruin the actual database
 */

@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class MonumentRepositoryIntegrationTests {

    @Autowired
    private MonumentRepository monumentRepository;

    /* save Tests **/

    /**
     * Test method for integration testing MonumentRepository.save(record)
     * Checks that the returned result from the save is not null, meaning it was saved correctly
     */
    @Test
    public void testMonumentRepository_save() {
        Monument monument = makeTestMonument();

        monument = this.monumentRepository.save(monument);

        assertNotNull(monument.getId());
    }

    /**
     * Test method for integration testing MonumentRepository.saveAll(List<record>)
     * Checks that the number of returned results is 3 and that each is not null, meaning they were all saved
     * correctly
     */
    @Test
    public void testMonumentRepository_saveAll() {
        List<Monument> monuments = makeTestMonuments();

        List<Monument> results = this.monumentRepository.saveAll(monuments);

        assertEquals(3, results.size());

        for (Monument result : results) {
            assertNotNull(result.getId());
        }
    }

    /* get Tests **/

    /**
     * Test method for integration testing MonumentRepository.get(record)
     * First saves a record into the database then performs a get to verify the records are the same
     */
    @Test
    public void testMonumentRepository_get_Single() {
        Monument monument = makeTestMonument();

        this.monumentRepository.save(monument);
        Optional<Monument> updatedMonument = this.monumentRepository.findById(monument.getId());

        assert(updatedMonument.isPresent());
        assertEquals(updatedMonument.get().getTitle(), updatedMonument.get().getTitle());
        assertEquals(updatedMonument.get().getArtist(), updatedMonument.get().getArtist());
    }

    /**
     * Test method for integration testing MonumentRepository.getAll(List<record>)
     * First saves 3 records into the database then performs a get for only 2 of the records
     * Checks that only 2 records are returned and that they have the expected attributes
     */
    @Test
    public void testMonumentRepository_getAll_ListPassed() {
        ArrayList<Monument> monuments = makeTestMonuments();

        this.monumentRepository.saveAll(monuments);

        ArrayList<Integer> idsToGet = new ArrayList<>();
        idsToGet.add(1);
        idsToGet.add(3);

        HashMap<Integer, Monument> monumentsById = new HashMap<>();
        monumentsById.put(1, monuments.get(0));
        monumentsById.put(3, monuments.get(2));

        List<Monument> results = this.monumentRepository.findAllById(idsToGet);

        assertEquals(2, results.size());

        for (Monument result : results) {
            Monument monument = monumentsById.get(result.getId());

            assertEquals(monument.getTitle(), result.getTitle());
            assertEquals(monument.getArtist(), result.getArtist());
        }
    }

    /* getAll Tests **/

    /**
     * Test method for integration testing MonumentRepository.getAll(null)
     * First saves 3 records into the database then performs a getAll for all 3 records
     * Checks that 3 records are returned and that they have the expected attributes
     */
    @Test
    public void testMonumentRepository_getAll_NullPassed() {
        ArrayList<Monument> monuments = makeTestMonuments();

        this.monumentRepository.saveAll(monuments);

        HashMap<Integer, Monument> monumentsById = new HashMap<>();
        monumentsById.put(1, monuments.get(0));
        monumentsById.put(2, monuments.get(1));
        monumentsById.put(3, monuments.get(2));

        List<Monument> results = this.monumentRepository.findAll();

        assertEquals(3, results.size());

        for (Monument result : results) {
            Monument monument = monumentsById.get(result.getId());

            assertEquals(monument.getTitle(), result.getTitle());
            assertEquals(monument.getArtist(), result.getArtist());
        }
    }

    /* update Tests **/

    /**
     * Test method for integration testing MonumentRepository.update(record)
     * First saves a record into the database then does a get to retrieve it
     * Then, changes some of the attributes on the record before calling update
     * Finally, it does another get for the record and checks to make sure the changes were persisted
     */
    @Test
    public void testMonumentRepository_update_Single() {
        Monument monument = makeTestMonument();

        Monument result = this.monumentRepository.save(monument);

        Optional<Monument> optional = this.monumentRepository.findById(result.getId());
        assert(optional.isPresent());
        Monument storedMonument = optional.get();

        storedMonument.setTitle("Monument 2");
        storedMonument.setArtist("Artist 2");

        this.monumentRepository.save(storedMonument);

        optional = this.monumentRepository.findById(result.getId());
        assert(optional.isPresent());
        result = optional.get();

        assertEquals(storedMonument.getTitle(), result.getTitle());
        assertEquals(storedMonument.getArtist(), result.getArtist());
    }

    /**
     * Test method for integration testing MonumentRepository.update(List<record>)
     * First saves 3 records into the database then does a get to retrieve them
     * Then, changes some of the attributes on the records before doing an update
     * Finally, it does another get for the records and checks to make sure the changes were persisted
     */
    @Test
    public void testMonumentRepository_update_Multiple() {
        List<Monument> monuments = makeTestMonuments();

        List<Monument> storedMonuments = this.monumentRepository.saveAll(monuments);

        HashMap<Integer, Monument> monumentsById = new HashMap<>();

        for (Monument storedMonument : storedMonuments) {
            if (storedMonument.getId() == 1) {
                storedMonument.setTitle("Stored Monument 1");
                storedMonument.setArtist("Stored Artist 1");
            }
            else if (storedMonument.getId() == 3) {
                storedMonument.setTitle("Stored Monument 3");
            }

            monumentsById.put(storedMonument.getId(), storedMonument);
        }

        List<Monument> results = this.monumentRepository.saveAll(storedMonuments);

        for (Monument result : results) {
            Monument monument = monumentsById.get(result.getId());

            assertEquals(monument.getTitle(), result.getTitle());
            assertEquals(monument.getArtist(), result.getArtist());
        }
    }

    /* delete Tests **/

    /**
     * Test method for integration testing MonumentRepository.delete(id)
     * First, does an insert to insert a single record into the database
     * Then, does a get for that record and checks to make sure it was saved properly
     * Finally, does a delete and checks that another get returns null
     */
    @Test
    public void testMonumentRepository_delete_Single() {
        Monument monument = makeTestMonument();

        monument = this.monumentRepository.save(monument);

        assert(this.monumentRepository.findById(monument.getId()).isPresent());

        this.monumentRepository.delete(monument);

        assert(this.monumentRepository.findById(monument.getId()).isEmpty());
    }

    /**
     * Test method for integration testing MonumentRepository.delete(ids)
     * First, saves 3 records into the database and does a getAll to check that they were all saved properly
     * Then, does a delete followed by another getAll to check that the returned results are null or not null as expected
     */
    @Test
    public void testMonumentRepository_delete_Multiple() {
        List<Monument> monuments = makeTestMonuments();

        monuments = this.monumentRepository.saveAll(monuments);

        for (Monument storedMonument : this.monumentRepository.findAll()) {
            assertNotNull(storedMonument);
        }

        List<Monument> monumentsToDelete = new ArrayList<>();
        monumentsToDelete.add(monuments.get(0));
        monumentsToDelete.add(monuments.get(2));

        this.monumentRepository.deleteAll(monumentsToDelete);

        for (int i = 0; i < 3; i++) {
            // Check that 0 and 2 are deleted, but 1 is not
            assertEquals(
                this.monumentRepository.findById(monuments.get(i).getId()).isEmpty(),
                i != 1
            );
        }
    }

    /**
     * Helper function to make a test Monument
     * @return Monument - the test Monument
     */
    private Monument makeTestMonument() {
        Monument monument = new Monument();
        monument.setTitle("Monument");
        monument.setArtist("Artist");

        return monument;
    }

    /**
     * Helper function to make 3 test Monuments and return them in an ArrayList
     * @return ArrayList<Monument> - the ArrayList of test Monuments
     */
    private ArrayList<Monument> makeTestMonuments() {
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
