import React from "react";
import {Button, Form} from "react-bootstrap";

const Searchbar = ({handleSearch, onChange, handleSearchMode, currentSearchMode}) => {
    const handleClick = () => {
        handleSearch()
    }

    const handleModeChange = () => {
        handleSearchMode()
    }

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleClick()
        }
    }
    return (
        <Form className="search-bar">
            <Form.Control type="text" placeholder="Search" onKeyPress={handleEnterPress} onChange={onChange}/>
            <p>{currentSearchMode ? 'Monument Search' : 'Creator Search'}</p>
            <Button onClick={handleModeChange}>
                <i className="material-icons">swap_vert</i>
            </Button>
            <Button onClick={handleClick}>
                <i className="material-icons">search</i>
            </Button>
        </Form>
    )
}

export default Searchbar
