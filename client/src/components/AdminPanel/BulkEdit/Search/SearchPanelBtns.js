import React, {useContext, useState} from 'react'
import {Button, ButtonGroup, Dropdown, DropdownButton, Modal} from "react-bootstrap";
import {deleteMonument} from "../../../../actions/update-monument";
import SearchResultContext from "../../../../contexts";
import {useDispatch} from "react-redux";
import {buildBulkExportData, exportToCsv} from "../../../../utils/export-util";
import {exportToPdf} from "../../../../utils/export-util";
import {pdfExportFields} from "../../../../utils/export-util";
import {csvExportFields} from "../../../../utils/export-util";
import moment from "moment";
import {RollbarContext} from "../../../../App";
import * as JSZip from "jszip";
import {getS3ImageNameFromObjectUrl, getS3ImageObjectKeyFromObjectUrl} from "../../../../utils/api-util";
import * as AWS from "aws-sdk";
import * as JSZipUtils from "jszip-utils";
import {saveAs} from 'file-saver';


const exportOptions = [
    ".CSV",
    ".PDF",
    ".ZIP"
]

const SearchPanelBtns = (queue) => {

    const [show, setShow] = useState(false)
    const del = useContext(SearchResultContext)
    const dispatch = useDispatch()
    const rollbar = useContext(RollbarContext);

    const confirmDelete = () => {
        for(var i = 0; i < queue.queue.length; i++){
            dispatch(deleteMonument(queue.queue[i].id));
            del(queue.queue[i].id);

        }

        setShow(false);
    }

    const exportSelectedFormat = (idx) =>{
        switch (exportOptions[idx]){
            case ".CSV":
                exportSelectedCsv();
                break;
            case ".PDF":
                exportSelectedPdf();
                break;
            case ".ZIP":
                exportSelectedZip();
                break
        }

    }

    const exportSelectedPdf = () => {
        var data = buildBulkExportData(queue.queue, pdfExportFields, true)
        exportToPdf(pdfExportFields, data,
            `Selected Monuments Data ${moment().format('YYYY-MM-DD hh:mm')}`);
        console.log(queue.queue);
        rollbar.info(`Exported monuments (${queue.queue.length}) to PDF`);
    }

    const exportSelectedCsv = () => {
        var data = buildBulkExportData(queue.queue, csvExportFields, true)
        const csv = exportToCsv(csvExportFields, data);
        const exportFileName = `Selected Monuments Data ${moment().format('YYYY-MM-DD hh:mm')}` + '.csv';
        const blob = new Blob([csv]);

        if (navigator.msSaveBlob) { // For Microsoft Edge
            navigator.msSaveBlob(blob, exportFileName);
        } else {
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportFileName);
                document.body.appendChild(link);
                link.click();
            }
        }
        rollbar.info(`Exported monuments (${queue.queue.length}) to CSV`);
    }

    const imageFromAWS = (imageUrl) => {
        // Setup the global AWS config
        AWS.config.update({
            region: 'us-east-2',
            accessKeyId: `${process.env.REACT_APP_AWS_ACCESS_KEY_ID}`,
            secretAccessKey: `${process.env.REACT_APP_AWS_SECRET_ACCESS_KEY}`
        });
        const s3Client = new AWS.S3();
        const key = getS3ImageObjectKeyFromObjectUrl(imageUrl)
        return s3Client.getObject({
            Bucket: 'monuments-and-memorials',
            Key: key
        }).promise();
    }

    const imageFromUrl = (imageUrl) => {
        return JSZipUtils.getBinaryContent(imageUrl, {})
    }

    const exportSelectedZip  = async  () => {
        var data = buildBulkExportData(queue.queue, csvExportFields.concat(['Image Names', 'Image Reference URLs', 'Image Captions']), true)
        const csv = exportToCsv(csvExportFields.concat(['Image Names', 'Image Reference URLs', 'Image Captions']), data);
        const exportFileName = `Selected Monuments Data ${moment().format('YYYY-MM-DD hh_mm')}` + '.csv';
        const zip = new JSZip();
        zip.file(exportFileName, csv);
        var exportImages = [];
        queue.queue.forEach(monument => {
            if (monument.images) {
                exportImages = exportImages.concat(monument.images)
            }
        })
        if (exportImages) {
            for (const image of exportImages) {
                if (image.isPhotoSphere) {
                    continue
                }

                let data
                try {
                    data = await imageFromAWS(image.url)
                    if (!data) {
                        await imageFromUrl(image.url).then(
                            (data2, err) => {
                                if (err) {
                                    throw err
                                } else {
                                    data = data2
                                }
                            }
                        )
                    }
                } catch (e) {
                    try {
                        await imageFromUrl(image.url).then(
                            (data2, err) => {
                                if (err) {
                                    throw err
                                } else {
                                    data = data2
                                }
                            }
                        )
                    } catch (e) {
                        alert('Problem happened when downloading img: ' + image.url);
                        console.error('Problem happened when downloading img: ' + image.url);
                        rollbar.error(e)
                        continue
                    }
                }

                let name = getS3ImageNameFromObjectUrl(image.url)
                if (!name.endsWith('.png') && !name.endsWith('.jpg')) {
                    name = name + '.jpg'
                }
                zip.file(name, data.Body, {binary: true});
            }
        }

        zip.generateAsync({type: "blob"})
            .then(function (content) {
                saveAs(content, "monuments.zip");
                rollbar.info(`Exported monuments (${data.length}) to Zip`);
            });
    }

    return (
        <ButtonGroup>
            <DropdownButton as={ButtonGroup} title="Export As" variant="info">

                {exportOptions.map((opt, idx) => (
                    <Dropdown.Item eventKey={idx} onClick={() => exportSelectedFormat(idx)}>{opt}</Dropdown.Item>

                ))}
            </DropdownButton>

            <Button variant="danger" onClick={() => setShow(true)}>Delete Selected</Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    Delete Selected Monuments?
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Are you sure you want to <strong>permanently</strong> delete {queue.queue.length} monuments or memorials?
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

        </ButtonGroup>
    )
}

export default SearchPanelBtns
