package com.monumental.repositories;

import com.monumental.models.Monument;
import com.monumental.models.Tag;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface TagRepository extends CrudRepository<Tag, Integer> {

    /**
     * This is automatically implemented by JPA - it will get all tags by matching name and isMaterial
     */
    @Transactional
    public List<Tag> getAllByNameAndIsMaterial(String name, Boolean isMaterial);

    /**
     * Get all tags for the specified monument
     * @param id Id of the monument to get the tags for
     */
    @Transactional
    @Query("select t from Tag t join t.monuments monument where monument.id = :id")
    public List<Tag> getAllByMonumentId(@Param("id") Integer id);

    @Transactional
    public List<Tag> getAllByName(String name);

    @Transactional
    public List<Tag> getAllByNameIn(List<String> names);
}
