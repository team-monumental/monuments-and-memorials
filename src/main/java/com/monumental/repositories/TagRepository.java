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

    List<Tag> getAllByIsMaterial(Boolean isMaterial);

    /**
     * Get all tags for the specified monument
     * @param id Id of the monument to get the tags for
     */
    @Query("select t from Tag t join t.monumentTags monumentTag where monumentTag.monument.id = :id")
    List<Tag> getAllByMonumentId(@Param("id") Integer id);

    /**
     * Get all Tags for the specified Monument and isMaterial value
     * @param id - ID of the Monument to get the Tags for
     * @param isMaterial - True to fetch Materials, False to fetch Tags
     */
    @Query("select t from Tag t join t.monumentTags monumentTag where monumentTag.monument.id = :id and t.isMaterial = :isMaterial")
    List<Tag> getAllByMonumentIdAndIsMaterial(@Param("id") Integer id, @Param("isMaterial") boolean isMaterial);

    List<Tag> getAllByName(String name);

    List<Tag> getAllByNameIn(List<String> names);
}
