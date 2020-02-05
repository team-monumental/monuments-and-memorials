package com.monumental.util.csvparsing;

import java.util.HashMap;
import java.util.Map;

/**
 * Class for holding information about a Bulk Monument Validation operation
 */
public class MonumentBulkValidationResult {

    private Map<Integer, CsvMonumentConverterResult> results = new HashMap<>();

    private String error;

    public Map<Integer, CsvMonumentConverterResult> getResults() {
        return this.results;
    }

    public void setResults(Map<Integer, CsvMonumentConverterResult> results) {
        this.results = results;
    }

    public String getError() {
        return this.error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
