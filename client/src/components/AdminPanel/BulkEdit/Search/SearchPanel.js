import React from 'react'
import {Container} from "react-bootstrap";

import Searchbar from "./Searchbar";
import SearchResultList from "./SearchResultList";

const SearchPanel = ({results, enqueue, dequeue, handleSearch, onChange}) => {
    return (
        <Container className="search-panel">
            <Searchbar handleSearch={handleSearch} onChange={onChange}/>
            <SearchResultList results={results} enqueue={enqueue} dequeue={dequeue}/>
        </Container>
    )
}

export default SearchPanel
