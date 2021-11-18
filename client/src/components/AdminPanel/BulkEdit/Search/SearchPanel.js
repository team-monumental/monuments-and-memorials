import React from 'react'
import BulkEditSearchBar from "./SearchPanelSearchbar";
import BulkEditSearchResults from "./SearchPanelResults";

const BulkEditSearchPanel = ({results, handleSearch}) => {
    return (
        <>
            <BulkEditSearchBar handleSearch={handleSearch}/>
            <BulkEditSearchResults results={results}/>
        </>
    )
}

export default BulkEditSearchPanel
