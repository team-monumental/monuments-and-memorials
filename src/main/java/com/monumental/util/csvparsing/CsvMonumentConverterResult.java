package com.monumental.util.csvparsing;

import com.monumental.models.Monument;
import com.monumental.models.Tag;

import java.util.ArrayList;
import java.util.List;

/**
 * Class used to encapsulate a result of calling CsvMonumentConverter.convertCsvRowToMonument
 */
public class CsvMonumentConverterResult {

    private Monument monument;

    private List<Tag> tags;

    public CsvMonumentConverterResult() {

    }

    public Monument getMonument() {
        return this.monument;
    }

    public void setMonument(Monument monument) {
        this.monument = monument;
    }

    public List<Tag> getTags() {
        if (this.tags == null) return null;
        List<Tag> tags = new ArrayList<>();
        for (Tag tag : this.tags) {
            if (!tag.getIsMaterial()) tags.add(tag);
        }
        return tags;
    }

    public void setTags(List<Tag> tags) {
        List<Tag> materials = this.getMaterials();
        if (this.tags != null && materials != null && materials.size() > 0) {
            materials.addAll(tags);
            this.tags = materials;
        } else {
            this.tags = tags;
        }
    }

    public List<Tag> getMaterials() {
        if (this.tags == null) return null;
        List<Tag> materials = new ArrayList<>();
        for (Tag tag : this.tags) {
            if (tag.getIsMaterial()) materials.add(tag);
        }
        return materials;
    }

    public void setMaterials(List<Tag> materials) {
        List<Tag> tags = this.getTags();
        if (this.tags != null && tags != null && tags.size() > 0) {
            tags.addAll(materials);
            this.tags = tags;
        } else {
            this.tags = materials;
        }
    }

    /**
     * Add a Tag to this.tags
     * If this.tags is null, initializes it to a new ArrayList
     * @param tag - Tag to add to this.tags
     */
    public void addTag(Tag tag) {
        if (this.tags == null) {
            this.tags = new ArrayList<>();
        }

        this.tags.add(tag);
    }
}
