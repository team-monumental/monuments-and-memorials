package com.monumental.services.integrationtest;

import com.monumental.models.Contribution;
import com.monumental.models.Monument;
import com.monumental.repositories.ContributionRepository;
import com.monumental.repositories.MonumentRepository;
import com.monumental.services.ContributionService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Test class used to integration test ContributionService
 * Makes use of an in-memory H2 database as to not ruin the real one
 */
@SpringBootTest
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@Transactional
public class ContributionServiceIntegrationTests {

    @Autowired
    ContributionService contributionService;

    @Autowired
    ContributionRepository contributionRepository;

    @Autowired
    MonumentRepository monumentRepository;

    /** getAllContributors Tests **/

    @Test
    public void testContributionService_getAllContributors_NoContributions() {
        List<String> results = this.contributionService.getAllContributors();

        assertEquals(0, results.size());
    }

    @Test
    public void testContributionService_getAllContributors_OneContributionOneMonument() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        Contribution contribution = this.makeTestContribution("Test", monument);
        contributionRepository.save(contribution);

        List<String> results = this.contributionService.getAllContributors();

        assertEquals(1, results.size());
        assertEquals("Test", results.get(0));
    }

    @Test
    public void testContributionService_getAllContributors_ThreeContributionsOneMonument() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Contribution> contributions = new ArrayList<>();

        Contribution contribution1 = this.makeTestContribution("Test", monument);
        contributions.add(contribution1);

        Contribution contribution2 = this.makeTestContribution("Test 2", monument);
        contributions.add(contribution2);

        Contribution contribution3 = this.makeTestContribution("Test 3", monument);
        contributions.add(contribution3);

        this.contributionRepository.saveAll(contributions);

        List<String> results = this.contributionService.getAllContributors();

        assertEquals(3, results.size());
        assertTrue(results.contains("Test"));
        assertTrue(results.contains("Test 2"));
        assertTrue(results.contains("Test 3"));
    }

    @Test
    public void testContributionService_getAllContributors_ThreeContributionsOneMonument_AllSameName() {
        Monument monument = new Monument();
        monument = this.monumentRepository.save(monument);

        List<Contribution> contributions = new ArrayList<>();

        Contribution contribution1 = this.makeTestContribution("Test", monument);
        contributions.add(contribution1);

        Contribution contribution2 = this.makeTestContribution("Test", monument);
        contributions.add(contribution2);

        Contribution contribution3 = this.makeTestContribution("Test", monument);
        contributions.add(contribution3);

        this.contributionRepository.saveAll(contributions);

        List<String> results = this.contributionService.getAllContributors();

        assertEquals(1, results.size());
        assertTrue(results.contains("Test"));
    }

    @Test
    public void testContributionService_getAllContributors_ThreeContributionsThreeMonuments() {
        Monument monument1 = new Monument();
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2 = this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3 = this.monumentRepository.save(monument3);

        List<Contribution> contributions = new ArrayList<>();

        Contribution contribution1 = this.makeTestContribution("Test", monument1);
        contributions.add(contribution1);

        Contribution contribution2 = this.makeTestContribution("Test 2", monument2);
        contributions.add(contribution2);

        Contribution contribution3 = this.makeTestContribution("Test 3", monument3);
        contributions.add(contribution3);

        this.contributionRepository.saveAll(contributions);

        List<String> results = this.contributionService.getAllContributors();

        assertEquals(3, results.size());
        assertTrue(results.contains("Test"));
        assertTrue(results.contains("Test 2"));
        assertTrue(results.contains("Test 3"));
    }

    @Test
    public void testContributionService_getAllContributors_ThreeContributionsThreeMonuments_AllSameName() {
        Monument monument1 = new Monument();
        monument1 = this.monumentRepository.save(monument1);

        Monument monument2 = new Monument();
        monument2 = this.monumentRepository.save(monument2);

        Monument monument3 = new Monument();
        monument3 = this.monumentRepository.save(monument3);

        List<Contribution> contributions = new ArrayList<>();

        Contribution contribution1 = this.makeTestContribution("Test", monument1);
        contributions.add(contribution1);

        Contribution contribution2 = this.makeTestContribution("Test", monument2);
        contributions.add(contribution2);

        Contribution contribution3 = this.makeTestContribution("Test", monument3);
        contributions.add(contribution3);

        this.contributionRepository.saveAll(contributions);

        List<String> results = this.contributionService.getAllContributors();

        assertEquals(1, results.size());
        assertTrue(results.contains("Test"));
    }

    /**
     * Make a test Contribution using the specified submitted by
     * @param submittedBy - String of the name to use as the submittedBy for the test Contribution
     * @param monument - Monument to associate the Contribution with
     * @return Contribution - Contribution object with the specified submitted by set and associated with the specified
     * Monument
     */
    private Contribution makeTestContribution(String submittedBy, Monument monument) {
        Contribution contribution = new Contribution();
        contribution.setSubmittedBy(submittedBy);
        contribution.setMonument(monument);
        return contribution;
    }
}
