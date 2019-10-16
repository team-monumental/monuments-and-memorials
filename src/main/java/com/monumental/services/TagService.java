package com.monumental.services;

import com.monumental.models.Tag;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService extends ModelService<Tag> {

    // TODO: This doesn't work, it needs to use the junction table
    public List<Tag> getByMonumentId(Integer monumentId) {
        return this.getByForeignKey("monument_id", monumentId);
    }
}
