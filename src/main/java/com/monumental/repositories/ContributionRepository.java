package com.monumental.repositories;

import com.monumental.models.Contribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface ContributionRepository extends JpaRepository<Contribution, Integer> {
}
