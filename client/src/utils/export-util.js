import { parse as toCSV } from 'json2csv';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'
import {prettyPrintDate} from "./string-util";

export const exportFields = ['Title', 'Artist', 'Date', 'City', 'State', 'Address', 'Coordinates', 'Materials', 'Tags',
    'Description', 'Inscription', 'Contributors', 'References', 'Last Updated'];

export function buildBulkExportData(monuments) {
    const data = []
    monuments.forEach(monument => {
        data.push(buildExportData(monument))
    })
    return data
}

export function buildExportData(monument, contributions=monument.contributions || [], references=monument.references || []) {
    let materialsList = '';
    let tagsList = '';
    if (monument.monumentTags && monument.monumentTags.length) {
        materialsList = monument.monumentTags.filter(monumentTag => monumentTag.tag.isMaterial)
            .map(monumentTag => monumentTag.tag.name).join(',');
        tagsList = monument.monumentTags.filter(monumentTag => !monumentTag.tag.isMaterial)
            .map(monumentTag => monumentTag.tag.name).join(',');
    }

    const prepareArray = (array=[], field) => {
        return array.map(el => el[field]).join(',');
    };

    const contributionsList = prepareArray(contributions, 'submittedBy');
    const referencesList = prepareArray(references, 'url');

    return [{
        'Title': monument.title,
        'Artist': monument.artist || '',
        'Date': monument.date ? prettyPrintDate(monument.date) : '',
        'City': monument.city || '',
        'State': monument.state || '',
        'Address': monument.address || '',
        'Coordinates': monument.coordinates ?
            `${monument.coordinates.coordinates[1]}, ${monument.coordinates.coordinates[0]}` :
            '',
        'Materials' : materialsList,
        'Tags': tagsList,
        'Description': monument.description || '',
        'Inscription': monument.inscription || '',
        'Contributors': contributionsList,
        'References': referencesList,
        'Last Updated': monument.updatedDate ? prettyPrintDate(monument.updatedDate) : ''
    }];
}

/**
 * Export the specified data with the specified fields to CSV format
 * @param fields - Array of the names of the columns for the CSV
 * @param data - Array of data representing the rows of the CSV
 */
export function exportToCsv(fields, data) {
    return 'data:text/csv;charset=utf-8,' + toCSV(data, {fields});
}

/**
 * Export the specified data with the specified fields to PDF format
 * @param fields - Array of the names of the columns for the PDF
 * @param data - Array of data representing the rows of the PDF
 * @param exportTitle - filename without extension
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

/**
 * Export the specified data with the specified fields to PDF format
 * @param fields - Array of the names of the columns for the PDF
 * @param data - Array of data representing the rows of the PDF
 * @param exportTitle - filename without extension
 */
export function bulkExportToPdf(fields, data, exportTitle) {
    const dataArr = []
    for (let i = 0; i < data.length; i++) {
        dataArr.push([])
        const monument = data[i]
        for (const field in monument[0]) {
            dataArr[i].push(monument[0][field])
        }
    }

    const doc = new jsPDF('landscape');

    doc.autoTable({
        head: [fields],
        body: dataArr,
        theme: 'grid',
        columnStyles: {
            0: {cellWidth: 25},
            12: {cellWidth: 23}
        }
    })

    doc.save(exportTitle + '.pdf')
}
