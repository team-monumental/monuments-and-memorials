package com.monumental.services;

import com.monumental.models.Contribution;
import com.monumental.repositories.ContributionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ContributionService {

    @Autowired
    private ContributionRepository contributionRepository;

    /**
     * Get all of the unique Contributors (right now just a name as a String)
     *
     * @return List<String> - The names of all of the Contributors
     */
    public List<String> getAllContributors() {
        List<Contribution> allContributions = this.contributionRepository.findAll();

        Set<String> contributors = new HashSet<>();

        for (Contribution contribution : allContributions) {
            contributors.add(contribution.getSubmittedBy());
        }

        return new ArrayList<>(contributors);
    }
}
