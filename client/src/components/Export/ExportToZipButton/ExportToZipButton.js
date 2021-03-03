import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { parse as toCSV } from 'json2csv';
import { getS3ImageNameFromObjectUrl, getS3ImageObjectKeyFromObjectUrl } from '../../../utils/api-util';
import { RollbarContext } from '../../../App';
import * as AWS from 'aws-sdk';

/**
 * Presentational component for a button that exports data to Zip
 */
export const ExportToZipButton = (props) => {

    const { className, data, fields, exportTitle, images } = props;
    const rollbar = useContext(RollbarContext)

    const handleClick = async () => {

        const csv = toCSV(data, {fields});
        const exportFileName = exportTitle.endsWith('.csv') ? exportTitle : exportTitle + '.csv';

        const zip = new JSZip();
        zip.file(exportFileName, csv);
        if (images){
            for (const image of images) {
                // Setup the global AWS config
                AWS.config.update({
                    region: 'us-east-2',
                    accessKeyId: `${process.env.REACT_APP_AWS_ACCESS_KEY_ID}`,
                    secretAccessKey: `${process.env.REACT_APP_AWS_SECRET_ACCESS_KEY}`
                });
                const key = getS3ImageObjectKeyFromObjectUrl(image.url)
                const s3Client = new AWS.S3();

                try {
                    let data = await s3Client.getObject({
                        Bucket: 'monuments-and-memorials',
                        Key: key
                    }).promise();
                    let name = getS3ImageNameFromObjectUrl(image.url)
                    if (!name.endsWith('.png') && !name.endsWith('.jpg')) {
                        name = name + '.jpg'
                    }
                    zip.file(name, data.Body, {binary: true});
                    console.log(data)
                } catch (e) {
                    alert('Problem happened when download img: ' + image.url);
                    console.error('Problem happened when download img: ' + image.url);
                }
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
