package com.monumental.repositories;

import com.monumental.models.Reference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface ReferenceRepository extends JpaRepository<Reference, Integer> {

    List<Reference> getAllByUrl(String url);
}
