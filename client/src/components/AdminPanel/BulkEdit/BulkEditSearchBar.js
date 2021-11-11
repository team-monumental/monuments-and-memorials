import React from "react";
import {FormControl, InputGroup} from "react-bootstrap";

const BulkEditSearchBar = (props) => {
    return (
        <InputGroup>
            <FormControl placeholder="Search"/>
            <InputGroup.Text className="search-bar"/>
        </InputGroup>
    )
}

export default BulkEditSearchBar
