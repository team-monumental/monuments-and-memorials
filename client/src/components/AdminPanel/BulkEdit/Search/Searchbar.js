import React from "react";
import {Button, Form} from "react-bootstrap";

// FIXME: Search button centering is a bit off
const Searchbar = ({handleSearch, onChange}) => {
    const handleClick = () => {
        handleSearch()
    }

    const handleEnterPress = (event) => {
        if(event.key === 'Enter'){
            event.preventDefault()
            handleClick()
        }
    }
    return (
        <Form className="search-bar">
            <Form.Control type="text" placeholder="Search" onKeyPress={handleEnterPress} onChange={onChange}/>
            <Button onClick={handleClick}>
                <i className="material-icons">search</i>
            </Button>
        </Form>
    )
}

export default Searchbar
