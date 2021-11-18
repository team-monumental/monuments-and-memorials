import React from 'react'
import Searchbar from "./Searchbar";
import SearchResultList from "./SearchResultList";

const SearchPanel = ({results, handleSearch}) => {
    return (
        <>
            <Searchbar handleSearch={handleSearch}/>
            <SearchResultList results={results}/>
        </>
    )
}

export default SearchPanel
