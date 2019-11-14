package com.monumental.repositories;

import com.monumental.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface TagRepository extends JpaRepository<Tag, Integer> {

    /**
     * This is automatically implemented by JPA - it will get all tags by matching name and isMaterial
     */
    List<Tag> getAllByNameAndIsMaterial(String name, Boolean isMaterial);

    /**
     * Get all tags for the specified monument
     * @param id Id of the monument to get the tags for
     */
    @Query("select t from Tag t join t.monuments monument where monument.id = :id")
    List<Tag> getAllByMonumentId(@Param("id") Integer id);

    List<Tag> getAllByName(String name);

    List<Tag> getAllByNameIn(List<String> names);
}
