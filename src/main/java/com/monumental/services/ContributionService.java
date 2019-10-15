package com.monumental.services;

import com.monumental.models.Contribution;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContributionService extends ModelService<Contribution> {

    /**
     * Public constructor for ContributionService
     * Use when NOT injecting SessionFactoryService via Spring
     * @param sessionFactoryService - instance of SessionFactoryService to use for initialization
     */
    public ContributionService(SessionFactoryService sessionFactoryService) {
        this.sessionFactoryService = sessionFactoryService;
    }

    /**
     * Public default constructor for ContributionService
     */
    public ContributionService() {

    }

    public List<Contribution> getByMonumentId(Integer monumentId) {
        return this.getByMonumentId(monumentId, false);
    }

    public List<Contribution> getByMonumentId(Integer monumentId, boolean initializeLazyLoadedCollections) {
        return this.getByForeignKey("monument_id", monumentId, initializeLazyLoadedCollections);
    }
}
