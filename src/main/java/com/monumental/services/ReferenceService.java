package com.monumental.services;

import com.monumental.models.Monument;
import com.monumental.models.Reference;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.monumental.util.string.StringHelper.isNullOrEmpty;

@Service
public class ReferenceService extends ModelService<Reference> {

    public List<Reference> createReferences(List<String> referenceUrls, Monument monument) {
        List<Reference> references = new ArrayList<>();

        if (referenceUrls != null && referenceUrls.size() > 0) {
            for (String referenceUrl : referenceUrls) {
                if (!isNullOrEmpty(referenceUrl)) {
                    Reference reference = new Reference(referenceUrl);
                    references.add(reference);

                    if (monument != null) {
                        reference.setMonument(monument);
                    }
                }
            }
        }

        return references;
    }

    public Reference createReference(String referenceUrl, Monument monument) {

    }
}
