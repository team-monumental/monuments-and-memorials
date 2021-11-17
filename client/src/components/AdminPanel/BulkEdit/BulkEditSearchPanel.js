import React from 'react'
import BulkEditSearchBar from "./BulkEditSearchBar";
import BulkEditSearchResults from "./BulkEditSearchResults";

const BulkEditSearchPanel = ({results, handleSearch}) => {
    return (
        <>
            <BulkEditSearchBar handleSearch={handleSearch}/>
            <BulkEditSearchResults results={results}/>
        </>
    )
}

export default BulkEditSearchPanel
