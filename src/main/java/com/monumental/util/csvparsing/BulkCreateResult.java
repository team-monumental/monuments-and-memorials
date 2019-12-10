package com.monumental.util.csvparsing;

import com.monumental.models.Monument;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Class for holding information about a Bulk Monument Create operation
 */
public class BulkCreateResult {

    private Integer monumentsInsertedCount;

    private List<Monument> validMonumentRecords;

    private Map<Integer, CsvMonumentConverterResult> invalidCsvMonumentRecordsByRowNumber;

    private Map<Integer, List<String>> invalidCsvMonumentRecordErrorsByRowNumber;

    public BulkCreateResult() {
        this.validMonumentRecords = new ArrayList<>();
        this.invalidCsvMonumentRecordsByRowNumber = new HashMap<>();
        this.invalidCsvMonumentRecordErrorsByRowNumber = new HashMap<>();
    }

    public Integer getMonumentsInsertedCount() {
        return this.monumentsInsertedCount;
    }

    public void setMonumentsInsertedCount(Integer monumentsInsertedCount) {
        this.monumentsInsertedCount = monumentsInsertedCount;
    }

    public List<Monument> getValidMonumentRecords() {
        return this.validMonumentRecords;
    }

    public void setValidMonumentRecords(List<Monument> validMonumentRecords) {
        this.validMonumentRecords = validMonumentRecords;
    }

    public Map<Integer, CsvMonumentConverterResult> getInvalidCsvMonumentRecordsByRowNumber() {
        return this.invalidCsvMonumentRecordsByRowNumber;
    }

    public void setInvalidCsvMonumentRecordsByRowNumber(Map<Integer, CsvMonumentConverterResult> invalidCsvMonumentRecordsByRowNumber) {
        this.invalidCsvMonumentRecordsByRowNumber = invalidCsvMonumentRecordsByRowNumber;
    }

    public Map<Integer, List<String>> getInvalidCsvMonumentRecordErrorsByRowNumber() {
        return this.invalidCsvMonumentRecordErrorsByRowNumber;
    }

    public void setInvalidCsvMonumentRecordErrorsByRowNumber(Map<Integer, List<String>> invalidCsvMonumentRecordErrorsByRowNumber) {
        this.invalidCsvMonumentRecordErrorsByRowNumber = invalidCsvMonumentRecordErrorsByRowNumber;
    }
}
