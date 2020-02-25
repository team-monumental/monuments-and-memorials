import { parse as toCSV } from 'json2csv';

/**
 * Export the specified data with the specified fields to CSV format
 * @param fields - Array of the names of the columns for the CSV
 * @param data - Array of data representing the rows of the CSV
 */
export function exportToCsv(fields, data) {
    return 'data:text/csv;charset=utf-8,' + toCSV(data, {fields});
}