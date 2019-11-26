package com.monumental.repositories;

import com.monumental.models.Reference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface ReferenceRepository extends JpaRepository<Reference, Integer> {
}