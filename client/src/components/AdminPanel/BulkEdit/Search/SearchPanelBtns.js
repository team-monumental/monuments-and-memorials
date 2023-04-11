import React, { useContext, useState } from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { deleteMonument } from "../../../../actions/update-monument";
import { useDispatch } from "react-redux";
import { buildBulkExportData, csvExportFields, pdfExportFields } from '../../../../utils/export-util'
import { ExportToCsvButton } from '../../../Export/ExportToCsvButton/ExportToCsvButton';
import { ExportToPdfButton } from '../../../Export/ExportToPdfButton/ExportToPdfButton';
import { ExportToZipButton } from '../../../Export/ExportToZipButton/ExportToZipButton';
import moment from 'moment';

const SearchPanelBtns = ({ queueList, dequeue, handleSearch }) => {

    const [show, setShow] = useState(false)
    const dispatch = useDispatch()

    const confirmDelete = () => {

        queueList.map(monument => {
            dequeue(monument.id);
            dispatch(deleteMonument(monument.id));
            handleSearch();
        })

        setShow(false);
    }

    let finalImages = []
    queueList.forEach(monument => {
        if (monument.images) {
            finalImages = finalImages.concat(monument.images)
        }
    })


    return (
        <div>
            <ButtonGroup className="panel-btns">
                <DropdownButton as={ButtonGroup} title="Export Options" variant="info">
                    <span>
                        <span>
                            <ExportToCsvButton className="mt-2" fields={csvExportFields}
                                data={buildBulkExportData(queueList, csvExportFields, true)}
                                exportTitle={`Bulk Edit Data ${moment().format('YYYY-MM-DD hh:mm')}`} />
                        </span>
                        <span>
                            <ExportToPdfButton className="mt-2" fields={pdfExportFields}
                                data={buildBulkExportData(queueList, pdfExportFields, true)}
                                exportTitle={`Bulk Edit Data ${moment().format('YYYY-MM-DD hh:mm')}`} />
                        </span>
                        <span>
                            <ExportToZipButton className="mt-2" fields={csvExportFields.concat(['Image Names', 'Image Reference URLs', 'Image Captions'])}
                                data={buildBulkExportData(queueList, csvExportFields.concat(['Image Names', 'Image Reference URLs', 'Image Captions']), true)}
                                exportTitle={`Bulk Edit Data ${moment().format('YYYY-MM-DD hh:mm')}`}
                                images={finalImages} />
                        </span>
                    </span>
                </DropdownButton>
                <Button variant="danger" onClick={() => setShow(true)}>Delete Selected</Button>
            </ButtonGroup>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    Delete Monuments?
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Are you sure you want to <strong>permanently</strong> delete these monuments or memorials? If you
                        would like to hide it from the public, you may de-activate it instead.
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

        </div>
    )
}

export default SearchPanelBtns
