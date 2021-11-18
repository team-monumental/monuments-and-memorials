import React from 'react'
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";

const exportOptions = [
    ".CSV",
    ".PDF",
    ".ZIP"
]

const SearchPanelButtons = (props) => {
    return (
        <ButtonGroup>
            <Dropdown as={ButtonGroup} title="Export Format">
                <Button variant="info">Export Selected</Button>
                <Dropdown.Toggle variant="outline-info" split/>
                <Dropdown.Menu>
                    {exportOptions.map((opt, idx) => (
                        <Dropdown.Item eventKey={idx}>{opt}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <Button variant="danger">Delete Selected</Button>
        </ButtonGroup>
    )
}

export default SearchPanelButtons
