import React from 'react'
import Searchbar from "./Searchbar";
import SearchResultList from "./SearchResultList";

const SearchPanel = ({results, enqueue, dequeue, handleSearch, onChange, onDelete}) => {
    return (
        <>
            <Searchbar handleSearch={handleSearch} onChange={onChange}/>
            <SearchResultList results={results} enqueue={enqueue} dequeue={dequeue} onDelete={onDelete} />
        </>
    )
}

export default SearchPanel
