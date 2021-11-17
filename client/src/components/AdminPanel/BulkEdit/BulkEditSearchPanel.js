import React from 'react'
import BulkEditSearchBar from "./BulkEditSearchBar";
import BulkEditSearchResults from "./BulkEditSearchResults";

const BulkEditSearchPanel = ({results, handleSearch}) => {
    return (
        <div>
            <BulkEditSearchBar handleSearch={handleSearch}/>
            <BulkEditSearchResults results={results}/>
        </div>
    )
}

export default BulkEditSearchPanel
