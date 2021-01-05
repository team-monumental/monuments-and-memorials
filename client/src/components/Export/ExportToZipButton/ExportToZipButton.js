import React from 'react';
import Button from 'react-bootstrap/Button';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { parse as toCSV } from 'json2csv';
import { getS3ImageNameFromObjectUrl } from '../../../utils/api-util';

/**
 * Presentational component for a button that exports data to CSV
 */
export default class ExportToZipButton extends React.Component {

    async handleClick() {
        const { fields, data, exportTitle, images } = this.props;

        const csv = toCSV(data, {fields});
        const exportFileName = exportTitle.endsWith('.csv') ? exportTitle : exportTitle + '.csv';

        const zip = new JSZip();
        zip.file(exportFileName, csv);
        if (images){
            for (const image of images) {
                await JSZipUtils.getBinaryContent(image.url, {}).then(
                    (data, err) => {
                        if (err) {
                            alert('Problem happened when download img: ' + image.url);
                            console.error('Problem happened when download img: ' + image.url);
                        } else {
                            let name = getS3ImageNameFromObjectUrl(image.url)
                            if (!name.endsWith('.png') && !name.endsWith('.jpg')) {
                                name = name + '.jpg'
                            }
                            zip.file(name, data, {binary: true});
                        }
                    }
                )
            }
        }

        zip.generateAsync({ type: "blob" })
            .then(function(content) {
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