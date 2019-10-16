package com.monumental.services;

import com.monumental.models.Contribution;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContributionService extends ModelService<Contribution> {

    public List<Contribution> getByMonumentId(Integer monumentId) {
        return this.getByForeignKey("monument_id", monumentId);
    }
}
