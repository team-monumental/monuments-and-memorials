package com.monumental.repositories;

import com.monumental.models.Monument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface MonumentRepository extends JpaRepository<Monument, Integer> {

    /**
     * Get all monuments with the specified tag
     * @param id Id of the tag to get the monuments for
     */
    @Query("select m from Monument m join m.tags tag where tag.id = :id")
    List<Monument> getAllByTagId(@Param("id") Integer id);

}
