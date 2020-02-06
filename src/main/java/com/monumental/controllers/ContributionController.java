package com.monumental.controllers;

import com.monumental.services.ContributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@Transactional
public class ContributionController {

    @Autowired
    ContributionService contributionService;

    @GetMapping("/api/contributors")
    public List<String> getAllContributors() {
        return this.contributionService.getAllContributors();
    }
}
