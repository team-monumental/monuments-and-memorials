package com.monumental.repositories;

import com.monumental.models.MonumentTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface MonumentTagRepository extends JpaRepository<MonumentTag, Integer> {

    void deleteAllByMonumentId(Integer monumentId);
}
