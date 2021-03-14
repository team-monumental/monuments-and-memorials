import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { parse as toCSV } from 'json2csv';
import { getS3ImageNameFromObjectUrl } from '../../../utils/api-util';
import { RollbarContext } from '../../../App';

/**
 * Presentational component for a button that exports data to CSV
 */
export const ExportToZipButton = (props) => {

    const { className, data, fields, exportTitle, images } = props;
    const rollbar = useContext(RollbarContext)

    const handleClick = async () => {

        const csv = toCSV(data, {fields});
        const exportFileName = exportTitle.endsWith('.csv') ? exportTitle : exportTitle + '.csv';

        const zip = new JSZip();
        zip.file(exportFileName, csv);
        if (images) {
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
                rollbar.info(`Exported monuments (${data.length}) to Zip`);
            });
    }

    const text = data && data.length > 1 ? "Export all to Zip" : "Export to Zip";

    return (
        <Button variant="light" className={className} onClick={() => handleClick()}>
            {text}
        </Button>
    );
}