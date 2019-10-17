package com.monumental.services;

import com.monumental.models.Tag;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService extends ModelService<Tag> {

    public List<Tag> getByMonumentId(Integer monumentId) {
        return this.getByJoinTable("monuments", "id", monumentId);
    }
}
