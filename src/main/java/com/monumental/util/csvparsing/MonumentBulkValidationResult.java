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

    public Map<Integer, CsvMonumentConverterResult> getValidResults() {
        return this.getResults(true);
    }

    public Map<Integer, CsvMonumentConverterResult> getInvalidResults() {
        return this.getResults(false);
    }

    private Map<Integer, CsvMonumentConverterResult> getResults(boolean successful) {
        Map<Integer, CsvMonumentConverterResult> validResults = new HashMap<>();
        for (Integer rowNumber : this.getResults().keySet()) {
            CsvMonumentConverterResult resultRow = this.getResults().get(rowNumber);
            if ((successful && resultRow.getErrors().size() == 0) || (!successful && resultRow.getErrors().size() > 0)) {
                validResults.put(rowNumber, resultRow);
            }
        }
        return validResults;
    }
}
