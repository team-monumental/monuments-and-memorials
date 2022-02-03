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
     *
     * @param id Id of the monument to get the tags for
     */
    @Query("select t from Tag t join t.monumentTags monumentTag where monumentTag.monument.id = :id")
    List<Tag> getAllByMonumentId(@Param("id") Integer id);

    /**
     * Get all Tags or Materials associated with the Monument with the specified ID
     *
     * @param id         - ID of the Monument to get the associated Tags for
     * @param isMaterial - True to fetch associated Materials, False to fetch associated Tags
     */
    @Query("select t from Tag t join t.monumentTags monumentTag where monumentTag.monument.id = :id and t.isMaterial = :isMaterial")
    List<Tag> getAllByMonumentIdAndIsMaterial(@Param("id") Integer id, @Param("isMaterial") boolean isMaterial);

    List<Tag> getAllByName(String name);

    List<Tag> getAllByNameIn(List<String> names);

    /**
     * Get all Tags (including Materials) in descending order of most uses
     * This returns a List<Object[]>, where Object[0] is the Tag and Object[1] is the count
     */
    @Query("select t, count(t.name) as tCount from Tag t join t.monumentTags mt on t.id = mt.tag.id group by t.id order by tCount desc")
    List<Object[]> getAllOrderByMostUsedDesc();
}