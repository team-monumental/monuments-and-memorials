import React from "react";
import {Button, FormControl, InputGroup} from "react-bootstrap";

// FIXME: Search button centering is a bit off
const BulkEditSearchBar = (props) => {
    return (
        <InputGroup className="search-bar">
            <FormControl placeholder="Search"/>
            <Button><i className="material-icons">search</i></Button>
        </InputGroup>
    )
}

export default BulkEditSearchBar
