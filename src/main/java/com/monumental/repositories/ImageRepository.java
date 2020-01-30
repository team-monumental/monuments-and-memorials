package com.monumental.repositories;

import com.monumental.models.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface ImageRepository extends JpaRepository<Image, Integer> {

    /**
     * Get all Images associated with the specified Monument ID
     * @param id - ID of the Monument to get the Images for
     */
    @Query("select i from Image i where monument_id = :id")
    List<Image> getAllByMonumentId(@Param("id") Integer id);
}
