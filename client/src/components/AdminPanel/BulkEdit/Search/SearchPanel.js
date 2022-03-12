import React from 'react'
import Searchbar from "./Searchbar";
import SearchResultList from "./SearchResultList";
import {Container} from "react-bootstrap";

const SearchPanel = ({results, enqueue, dequeue, handleSearch, onChange}) => {
    return (
        <Container className="search-panel">
            <Searchbar handleSearch={handleSearch} onChange={onChange}/>
            <SearchResultList results={results} enqueue={enqueue} dequeue={dequeue}/>
        </Container>
    )
}

export default SearchPanel
