package com.monumental.triggers;

import com.monumental.exceptions.*;
import com.monumental.models.Tag;
import com.monumental.services.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TagTrigger extends ModelTrigger<Tag> {

    @Autowired
    TagService tagService;

    @Override
    void beforeInsert(Tag tag) {
        // Only insert the Tag if it's not a duplicate
        // A duplicate Tag is defined as having the same name as another Tag
        if (this.tagService.getTagsByName(tag.getName()).size() > 0) {
            throw new DuplicateRecordException();
        }
    }
}
