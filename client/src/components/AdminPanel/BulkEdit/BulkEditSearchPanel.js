import React from 'react'
import BulkEditSearchBar from "./BulkEditSearchBar";
import BulkEditSearchResults from "./BulkEditSearchResults";

const testSearchResults = [
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
            <BulkEditSearchResults searchResults={testSearchResults}/>
        </div>
    )
}

export default BulkEditSearchPanel
