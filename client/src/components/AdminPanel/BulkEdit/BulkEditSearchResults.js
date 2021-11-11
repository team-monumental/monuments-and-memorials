import React from 'react';
import {ListGroup} from "react-bootstrap";
import BulkEditSearchResult from "./BulkEditSearchResult";

const BulkEditSearchResults = ({searchResults}) => {
    return (
        <div>
            <ListGroup>
                {searchResults.map(result => (
                    <BulkEditSearchResult
                        title={result.title}
                        artist={result.artist}
                        date={result.date}
                        tags={result.tags}/>
                ))}
            </ListGroup>
        </div>
    )
}

export default BulkEditSearchResults
