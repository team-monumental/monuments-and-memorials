import React from 'react'
import {Container} from "react-bootstrap";

import Searchbar from "./Searchbar";
import SearchResultList from "./SearchResultList";

const SearchPanel = ({results, queueList, enqueue, dequeue, handleSearch, onChange, handleSearchMode, currentSearchMode}) => {
    return (
        <Container className="search-panel">
            <Searchbar handleSearch={handleSearch} onChange={onChange} handleSearchMode={handleSearchMode} 
                currentSearchMode={currentSearchMode}/>
            <SearchResultList results={results} enqueue={enqueue} dequeue={dequeue} queueList={queueList}/>
        </Container>
    )
}

export default SearchPanel
