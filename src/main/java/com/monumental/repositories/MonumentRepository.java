package com.monumental.repositories;

import com.monumental.models.Monument;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface MonumentRepository extends CrudRepository<Monument, Integer> {

}
