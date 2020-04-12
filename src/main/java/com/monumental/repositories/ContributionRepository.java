package com.monumental.repositories;

import com.monumental.models.Contribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface ContributionRepository extends JpaRepository<Contribution, Integer> {

    List<Contribution> getAllBySubmittedByUserId(Integer submittedByUserId);

    /**
     * Get all Contributions associated with the specified Monument ID
     * @param id - ID of the Monument to get the Contributions for
     */
    @Query("select c from Contribution c where monument_id = :id")
    List<Contribution> getAllByMonumentId(@Param("id") Integer id);
}
