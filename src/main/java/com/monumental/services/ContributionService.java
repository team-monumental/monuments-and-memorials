package com.monumental.services;

import com.monumental.models.Contribution;
import com.monumental.repositories.ContributionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContributionService {

    @Autowired
    ContributionRepository contributionRepository;

    /**
     * Get all of the Contributors (right now just a name as a String)
     * @return List<String> - The names of all of the Contributors
     */
    public List<String> getAllContributors() {
        List<Contribution> allContributions = this.contributionRepository.findAll();

        List<String> contributors = new ArrayList<>();

        for (Contribution contribution : allContributions) {
            contributors.add(contribution.getSubmittedBy());
        }

        return contributors;
    }
}
