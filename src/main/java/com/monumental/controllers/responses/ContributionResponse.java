package com.monumental.controllers.responses;

import com.monumental.models.Contribution;
import com.monumental.models.Monument;

import java.util.ArrayList;
import java.util.List;

public class ContributionResponse {

    public Contribution contribution;
    public Monument monument;

    public ContributionResponse(Contribution contribution) {
        this.contribution = contribution;
        this.monument = contribution.getMonument();
    }

    public static List<ContributionResponse> createContributionResponses(List<Contribution> contributions) {
        if (contributions == null) return null;
        List<ContributionResponse> responses = new ArrayList<>();
        for (Contribution contribution : contributions) {
            responses.add(new ContributionResponse(contribution));
        }
        return responses;
    }
}
