package com.monumental.repositories;

import com.monumental.models.Monument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.Tuple;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface MonumentRepository extends JpaRepository<Monument, Integer> {

    /**
     * Get all monuments with the specified tag
     * @param id Id of the tag to get the monuments for
     */
    @Query("select m from Monument m join m.monumentTags monumentTag where monumentTag.tag.id = :id")
    List<Monument> getAllByTagId(@Param("id") Integer id);

    /**
     * Searches for monuments with matching tags by name, returning those with the most matching tags
     * @param names - The tag names to match against
     * @param monumentId - The monument to exclude from search results
     * @param pageable - Used to give the search a limit
     * @return Tuples of monuments with their count of matching tags
     */
    @Query("select m, count(t.id) as c from Monument m join m.monumentTags monumentTag join monumentTag.tag t where t.name in :names and m.id <> :id and monumentTag.monument.id = m.id group by m.id order by c desc")
    List<Tuple> getRelatedMonuments(@Param("names") List<String> names, @Param("id") Integer monumentId, Pageable pageable);

    @Query("select m, count(t.id) as c from Monument m join m.monumentTags mt join mt.tag t where t.name in :names and m.id = :id group by m.id order by c desc")
    List<Tuple> testQuery(@Param("names") List<String> names, @Param("id") Integer monumentId);
}
