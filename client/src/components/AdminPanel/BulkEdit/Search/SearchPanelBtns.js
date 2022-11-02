import React from 'react'
import {Button, ButtonGroup, Dropdown, DropdownButton} from "react-bootstrap";

const exportOptions = [
    ".CSV",
    ".PDF",
    ".ZIP"
]

const SearchPanelBtns = (props) => {
    return (
        <ButtonGroup className="panel-btns">
            <DropdownButton as={ButtonGroup} title="Export As" variant="info">
                {exportOptions.map((opt, idx) => (
                    <Dropdown.Item key={`search-panel-btn-${idx}`} eventKey={idx}>
                        {opt}
                    </Dropdown.Item>
                ))}
            </DropdownButton>
            <Button variant="danger">Delete Selected</Button>
        </ButtonGroup>
    )
}

export default SearchPanelBtns
