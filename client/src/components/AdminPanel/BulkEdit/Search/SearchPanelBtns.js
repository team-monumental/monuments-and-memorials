import React from 'react'
import {Button, ButtonGroup, Dropdown, DropdownButton} from "react-bootstrap";

const exportOptions = [
    ".CSV",
    ".PDF",
    ".ZIP"
]

const SearchPanelBtns = (props) => {
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
            <Button variant="danger">Delete Selected</Button>
        </ButtonGroup>
    )
}

export default SearchPanelBtns
