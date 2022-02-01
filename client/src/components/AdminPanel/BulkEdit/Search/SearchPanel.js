import React from 'react'
import Searchbar from "./Searchbar";
import SearchResultList from "./SearchResultList";

const SearchPanel = ({results, enqueue, dequeue, handleSearch, onChange}) => {
    return (
        <>
            <Searchbar handleSearch={handleSearch} onChange={onChange}/>
            <SearchResultList results={results} enqueue={enqueue} dequeue={dequeue}/>
        </>
    )
}

export default SearchPanel
