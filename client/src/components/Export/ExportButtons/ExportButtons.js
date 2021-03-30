import React from 'react';
import moment from 'moment';
import { buildBulkExportData, csvExportFields, pdfExportFields } from '../../../utils/export-util';
import { ExportToCsvButton } from '../ExportToCsvButton/ExportToCsvButton';
import { ExportToPdfButton } from '../ExportToPdfButton/ExportToPdfButton';
import { ExportToZipButton } from '../ExportToZipButton/ExportToZipButton';

/**
 * Presentational component for a button that exports data to CSV
 */
export default class ExportButtons extends React.Component {

    render() {
        const { monuments, title, images } = this.props;
        let finalImages = images
        if (!finalImages) {
            finalImages = []
            monuments.forEach(monument => {
                if (monument.images) {
                    finalImages = finalImages.concat(monument.images)
                }
            })
        }

        return (
            <span>
                <span>
                    <ExportToCsvButton className="mt-2" fields={csvExportFields}
                                       data={buildBulkExportData(monuments, csvExportFields, false)}
                                       exportTitle={`${title} Data ${moment().format('YYYY-MM-DD hh:mm')}`} />
                </span>
                <span style={{marginLeft: '5px'}}>
                    <ExportToPdfButton className="mt-2" fields={pdfExportFields}
                                       data={buildBulkExportData(monuments, pdfExportFields, true)}
                                       exportTitle={`${title} Data ${moment().format('YYYY-MM-DD hh:mm')}`} />
                </span>
                <span style={{marginLeft: '5px'}}>
                    <ExportToZipButton className="mt-2" fields={csvExportFields.concat(['Image Names', 'Image Reference URLs', 'Image Captions'])}
                                       data={buildBulkExportData(monuments, csvExportFields.concat(['Image Names', 'Image Reference URLs', 'Image Captions']), false)}
                                       exportTitle={`${title} Data ${moment().format('YYYY-MM-DD hh:mm')}`}
                                       images={finalImages} />
                </span>
            </span>
        );
    }
}
