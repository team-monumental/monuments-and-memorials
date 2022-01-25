import React from "react";
import {Button, Form} from "react-bootstrap";

// FIXME: Search button centering is a bit off
const Searchbar = ({handleSearch, onChange}) => {
    const handleClick = () => {
        handleSearch()
    }

    return (
        <Form className="search-bar">
            <Form.Control type="text" placeholder="Search" onChange={onChange}/>
            <Button onClick={handleClick}>
                <i className="material-icons">search</i>
            </Button>
        </Form>
    )
}

export default Searchbar
