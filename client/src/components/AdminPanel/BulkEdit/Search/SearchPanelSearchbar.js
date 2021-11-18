import React from "react";
import {Button, Form} from "react-bootstrap";

// FIXME: Search button centering is a bit off
const BulkEditSearchBar = ({handleSearch}) => {
    const handleClick = () => {
        handleSearch()
    }

    return (
        <Form className="search-bar">
            <Form.Control type="text" placeholder="Search"/>
            <Button onClick={handleClick}>
                <i className="material-icons">search</i>
            </Button>
        </Form>
    )
}

export default BulkEditSearchBar
