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
        return this.tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
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
