import React from 'react'
import Searchbar from "./Searchbar";
import SearchResultList from "./SearchResultList";

const SearchPanel = ({results, handleSearch, onChange}) => {
    return (
        <>
            <Searchbar handleSearch={handleSearch} onChange={onChange}/>
            <SearchResultList results={results}/>
        </>
    )
}

export default SearchPanel
