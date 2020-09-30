import { parse as toCSV } from 'json2csv';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'

/**
 * Export the specified data with the specified fields to CSV format
 * @param fields - Array of the names of the columns for the CSV
 * @param data - Array of data representing the rows of the CSV
 */
export function exportToCsv(fields, data) {
    return 'data:text/csv;charset=utf-8,' + toCSV(data, {fields});
}

/**
 * Export the specified data with the specified fields to CSV format
 * @param fields - Array of the names of the columns for the CSV
 * @param data - Array of data representing the rows of the CSV
 */
export function exportToPdf(fields, data, exportTitle) {
    const dataArr = []
    for (const field in data[0]) {
        dataArr.push(data[0][field])
    }

    const doc = new jsPDF('landscape');

    doc.autoTable({
        head: [fields],
        body: [dataArr],
        theme: 'grid',
        columnStyles: {
            0: {cellWidth: 25},
            12: {cellWidth: 23}
        }
    })

    doc.save(exportTitle + '.pdf')
}
