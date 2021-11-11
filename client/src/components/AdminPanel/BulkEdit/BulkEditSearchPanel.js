import React from 'react'
import BulkEditSearchBar from "./BulkEditSearchBar";
import BulkEditSearchResults from "./BulkEditSearchResults";

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
    }
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
