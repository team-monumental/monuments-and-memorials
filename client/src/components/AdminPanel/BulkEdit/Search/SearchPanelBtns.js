import React, {useContext, useState} from 'react'
import {Button, ButtonGroup, Dropdown, DropdownButton, Modal} from "react-bootstrap";
import {deleteMonument} from "../../../../actions/update-monument";
import SearchResultContext from "../../../../contexts";
import {useDispatch} from "react-redux";

const exportOptions = [
    ".CSV",
    ".PDF",
    ".ZIP"
]

const SearchPanelBtns = (queue) => {

    const [show, setShow] = useState(false)
    const del = useContext(SearchResultContext)
    const dispatch = useDispatch()

    const confirmDelete = () => {
        for(var i = 0; i < queue.queue.length; i++){
            //console.log(queue.queue[i].id);
            dispatch(deleteMonument(queue.queue[i].id));
            del(queue.queue[i].id);
        }

        setShow(false);
    }

    return (
        <ButtonGroup>
            <DropdownButton as={ButtonGroup} title="Export As" variant="info">
                {/*<Button variant="info">Export Selected</Button>*/}
                {/*<Dropdown.Toggle variant="outline-info" split/>*/}
                {/*<Dropdown.Menu>*/}
                {/*    {exportOptions.map((opt, idx) => (*/}
                {/*        <Dropdown.Item eventKey={idx}>{opt}</Dropdown.Item>*/}
                {/*    ))}*/}
                {/*</Dropdown.Menu>*/}
                {exportOptions.map((opt, idx) => (
                    <Dropdown.Item eventKey={idx}>{opt}</Dropdown.Item>
                ))}
            </DropdownButton>
            <Button variant="danger" onClick={() => setShow(true)}>Delete Selected</Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    Delete Selected Monuments?
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Are you sure you want to <strong>permanently</strong> delete {queue.length} monuments or memorials?
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
