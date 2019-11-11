package com.monumental.services;

import com.monumental.models.Tag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface TagRepository extends CrudRepository<Tag, Integer> {

    /**
     * This is automatically implemented by JPA - it will get all tags by matching name
     */
    @Transactional
    public List<Tag> getAllByName(String name);
}
