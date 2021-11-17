import React from 'react'
import BulkEditSearchBar from "./SearchPanelSearchbar";
import BulkEditSearchResults from "./SearchPanelResults";

import "./Search.scss"

const placeholderResults = [
    {
        artist: 'John Doe',
        date: '01/01/2021',
        tags: ['fake', 'real', 'yes'],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        date: '01/01/2021',
        tags: ['fake', 'real', 'yes'],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        date: '01/01/2021',
        tags: ['fake', 'real', 'yes'],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        date: '01/01/2021',
        tags: ['fake', 'real', 'yes'],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        date: '01/01/2021',
        tags: ['fake', 'real', 'yes'],
        title: 'Unknown'
    },
]

const BulkEditSearchPanel = () => {
    return (
        <div>
            <BulkEditSearchBar/>
            <BulkEditSearchResults searchResults={placeholderResults}/>
        </div>
    )
}

export default BulkEditSearchPanel
