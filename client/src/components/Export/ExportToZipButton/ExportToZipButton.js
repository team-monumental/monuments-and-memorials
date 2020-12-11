import React from 'react';
import Button from 'react-bootstrap/Button';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportToCsv } from '../../../utils/export-util';
import {parse as toCSV} from "json2csv";

/**
 * Presentational component for a button that exports data to CSV
 */
export default class ExportToZipButton extends React.Component {

    handleClick() {
        const { fields, data, exportTitle } = this.props;

        const csv = toCSV(data, {fields});
        const exportFileName = exportTitle.endsWith('.csv') ? exportTitle : exportTitle + '.csv';

        const zip = new JSZip();
        zip.file(exportFileName, csv);
        // var img = zip.folder("images");
        // img.file("smile.gif", imgData, {base64: true});
        zip.generateAsync({ type: "blob" })
            .then(function(content) {
                // see FileSaver.js
                saveAs(content, "monuments.zip");
            });
    }

    render() {
        const { className, data } = this.props;
        const text = data && data.length > 1 ? "Export all to Zip" : "Export to Zip"

        return (
            <Button variant="light" className={className} onClick={() => this.handleClick()}>
                {text}
            </Button>
        );
    }
}