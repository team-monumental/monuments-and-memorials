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

        return (
            <span>
                <span>
                    <ExportToCsvButton className="mt-2" fields={csvExportFields}
                                       data={buildBulkExportData(monuments, csvExportFields, true)}
                                       exportTitle={`${title} Data ${moment().format('YYYY-MM-DD hh:mm')}`} />
                </span>
                <span style={{marginLeft: '5px'}}>
                    <ExportToPdfButton className="mt-2" fields={pdfExportFields}
                                       data={buildBulkExportData(monuments, pdfExportFields, true)}
                                       exportTitle={`${title} Data ${moment().format('YYYY-MM-DD hh:mm')}`} />
                </span>
                <span style={{marginLeft: '5px'}}>
                    <ExportToZipButton className="mt-2" fields={csvExportFields.concat(['Images', 'Image Reference URLs', 'Image Captions'])}
                                       data={buildBulkExportData(monuments, csvExportFields.concat(['Images', 'Image Reference URLs', 'Image Captions']), true)}
                                       exportTitle={`${title} Data ${moment().format('YYYY-MM-DD hh:mm')}`}
                                       images={images} />
                </span>
            </span>
        );
    }
}
