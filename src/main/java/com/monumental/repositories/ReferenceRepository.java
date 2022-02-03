package com.monumental.repositories;

import com.monumental.models.Reference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface ReferenceRepository extends JpaRepository<Reference, Integer> {

    List<Reference> getAllByUrl(String url);

    /**
     * Get all References associated with the specified Monument ID
     *
     * @param id - ID of the Monument to get the References for
     */
    @Query("select r from Reference r where monument_id = :id")
    List<Reference> getAllByMonumentId(@Param("id") Integer id);
}
