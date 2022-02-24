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

    const exportSelectedZip = () => {

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
