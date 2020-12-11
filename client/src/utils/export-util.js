import { parse as toCSV } from 'json2csv';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {getUserFullName, simplePrintDate} from './string-util';

export const pdfExportFields = ['Title', 'ID', 'Artist', 'Date Created', 'Deactivated Date', 'City', 'State', 'Address',
    'Coordinates', 'Materials', 'Tags', 'Description', 'Inscription', 'Contributors', 'References', 'Last Updated'];
export const csvExportFields = ['ID', 'Title', 'Artist', 'Date Created', 'Materials', 'Latitude', 'Longitude', 'City',
    'State', 'Address', 'Inscription', 'Description', 'Tags', 'Contributors', 'References', 'Deactivated Date',
    'Deactivation Reason', 'Is Temporary', 'Last Updated'];

export function buildBulkExportData(monuments, fields=csvExportFields, pretty=false) {
    const data = []
    monuments.forEach(monument => {
        data.push(buildExportData(monument, fields, pretty))
    })
    return data
}

export function buildExportData(monument, fields=csvExportFields, pretty=false, contributions=monument.contributions || [],
                                references=monument.references || []) {
    const prepareArray = (array=[], field) => {
        let arr = array.map(it => it[field]);
        const set = arr.filter((item, index) => arr.indexOf(item) === index);
        if (pretty) {
            return set.join(', ');
        } else {
            return set.join(',');
        }
    };

    const result = {};
    fields.forEach(field => {
        const lowerField = field.toLowerCase()
        if (lowerField.includes('title')) {
            result[field] = monument.title;
        } else if (lowerField.includes('id')) {
            result[field] = monument.id || '';
        } else if (lowerField.includes('artist')) {
            result[field] = monument.artist || '';
        } else if (lowerField.includes('date created')) {
            result[field] = monument.date ? simplePrintDate(monument.date, monument.dateFormat) : '';
        } else if ((lowerField.includes('deactivated') || lowerField.includes('deactivation')) && lowerField.includes('date')) {
            result[field] = monument.deactivatedDate ? simplePrintDate(monument.deactivatedDate, monument.deactivatedDateFormat) : '';
        } else if ((lowerField.includes('deactivated') || lowerField.includes('deactivation')) && (lowerField.includes('reason') || lowerField.includes('comment'))) {
            result[field] = monument.deactivatedComment || '';
        } else if (lowerField.includes('city')) {
            result[field] = monument.city || '';
        } else if (lowerField.includes('state')) {
            result[field] = monument.state || '';
        } else if (lowerField.includes('address')) {
            result[field] = monument.address || '';
        } else if (lowerField.includes('coordinates')) {
            result[field] = monument.coordinates ?
                `${monument.coordinates.coordinates[1]}, ${monument.coordinates.coordinates[0]}` : '';
        } else if (lowerField.includes('lat')) {
            result[field] = monument.coordinates ? monument.coordinates.coordinates[1] : '';
        } else if (lowerField.includes('lon')) {
            result[field] = monument.coordinates ? monument.coordinates.coordinates[0] : '';
        } else if (lowerField.includes('material')) {
            let materialsList = '';
            if (monument.monumentTags && monument.monumentTags.length) {
                const materialsArray = monument.monumentTags.filter(monumentTag => monumentTag.tag.isMaterial)
                    .map(monumentTag => monumentTag.tag.name);

                if (pretty) {
                    materialsList = materialsArray.join(', ')
                } else {
                    materialsList = materialsArray.join(',')
                }
            }
            result[field] = materialsList;
        } else if (lowerField.includes('tag')) {
            let tagsList = '';
            if (monument.monumentTags && monument.monumentTags.length) {
                const tagsArray = monument.monumentTags.filter(monumentTag => !monumentTag.tag.isMaterial)
                    .map(monumentTag => monumentTag.tag.name);

                if (pretty) {
                    tagsList = tagsArray.join(', ')
                } else {
                    tagsList = tagsArray.join(',')
                }
            }
            result[field] = tagsList;
        } else if (lowerField.includes('address')) {
            result[field] = monument.address || '';
        } else if (lowerField.includes('description')) {
            result[field] = monument.description || '';
        } else if (lowerField.includes('inscription')) {
            result[field] = monument.inscription || '';
        } else if (lowerField.includes('reference')) {
            result[field] = prepareArray(references, 'url');
        } else if (lowerField.includes('contributor')) {
            let contributionsFormatted = contributions.map(contribution => {
                if (contribution.submittedByUser) {
                    contribution.submittedBy = getUserFullName(contribution.submittedByUser);
                }
                return contribution;
            });

            result[field] = prepareArray(contributionsFormatted, 'submittedBy');
        } else if (lowerField.includes('updated')) {
            const dateFromContributions = (contributions=[]) => {
                if (contributions && contributions.length > 0) {
                    return simplePrintDate(contributions[contributions.length - 1].createdDate)
                }
                return ''
            };

            result[field] = monument.updatedDate ? simplePrintDate(monument.updatedDate)
                : dateFromContributions(monument.contributions);
        } else if (lowerField.includes('temporary')) {
            result[field] = monument.isTemporary || false;
        }
    })

    return result
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
    for (let i = 0; i < data.length; i++) {
        dataArr.push([])
        const monument = data[i]
        for (const field in monument) {
            dataArr[i].push(monument[field])
        }
    }

    const doc = new jsPDF('landscape');

    doc.autoTable({
        head: [fields],
        body: dataArr,
        theme: 'grid',
        columnStyles: {
            0: {cellWidth: 24},
            1: {cellWidth: 10},
            2: {cellWidth: 18},
            3: {cellWidth: 21},
            4: {cellWidth: 21},
            5: {cellWidth: 16},
            6: {cellWidth: 11},
            8: {cellWidth: 16},
            10: {cellWidth: 20},
            11: {cellWidth: 25},
            12: {cellWidth: 23},
            13: {cellWidth: 18},
            14: {cellWidth: 23},
            15: {cellWidth: 18}
        },
        margin: {
            right: 0,
            left: 0,
            top: 0,
            bottom: 0
        },
        styles: {
            fontSize: 9
        },
        rowPageBreak: 'avoid'
    })

    doc.save(exportTitle + '.pdf')
}
