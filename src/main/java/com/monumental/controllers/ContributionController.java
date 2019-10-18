package com.monumental.controllers;

import com.monumental.models.Contribution;
import com.monumental.services.ContributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ContributionController {

    @Autowired
    ContributionService contributionService;

    @GetMapping("/api/contributions")
    public List<Contribution> getContributions(@RequestParam Integer monumentId) {
        return this.contributionService.getByMonumentId(monumentId);
    }
}
