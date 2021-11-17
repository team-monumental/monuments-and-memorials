import React from 'react';
import {ListGroup} from "react-bootstrap";
import BulkEditSearchResult from "./BulkEditSearchResult";

const BulkEditSearchResults = ({results}) => {
    return (
        <ListGroup as="ol" variant="flush">
            <ListGroup.Item className="results-header" as="li">
                <p>NAME</p>
                <p>ARTIST</p>
                <p>DATE CREATED</p>
                <p>TAGS</p>
            </ListGroup.Item>
            {results.map(result => (
                <BulkEditSearchResult
                    title={result.title}
                    artist={result.artist}
                    date={result.date}
                    tags={result.tags}/>
            ))}
        </ListGroup>
    )
}

export default BulkEditSearchResults
