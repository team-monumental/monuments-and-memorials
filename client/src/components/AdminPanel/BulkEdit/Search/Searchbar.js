import React from "react";
import { Button, Form, ToggleButtonGroup, ToggleButton } from "react-bootstrap";

const Searchbar = ({ handleSearch, onChange, handleSearchMode, currentSearchMode }) => {
    const handleClick = () => {
        handleSearch()
    }

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleClick()
        }
    }
    return (
        <Form className="search-bar">
            <Form.Control type="text" placeholder="Search" onKeyPress={handleEnterPress} onChange={onChange} />
            <ToggleButtonGroup
                color="primary"
                value={currentSearchMode}
                exclusive
                onChange={handleSearchMode}
                aria-label="Platform"
                name="searchMode"
            >
                <ToggleButton name="monument" value="monument">Monument Search</ToggleButton>
                <ToggleButton name="creator" value="creator">Creator Search</ToggleButton>
            </ToggleButtonGroup>
            <Button onClick={handleClick}>
                <i className="material-icons">search</i>
            </Button>
        </Form>
    )
}

export default Searchbar
