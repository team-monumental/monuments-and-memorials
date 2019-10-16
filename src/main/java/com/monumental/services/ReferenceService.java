package com.monumental.services;

import com.monumental.models.Reference;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReferenceService extends ModelService<Reference> {

    public List<Reference> getByMonumentId(Integer monumentId) {
        return this.getByForeignKey("monument_id", monumentId);
    }
}
