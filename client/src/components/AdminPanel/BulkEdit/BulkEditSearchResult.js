import React from 'react'
import {InputGroup, ListGroup} from "react-bootstrap";

// TODO: Apply CSS classes to format
const BulkEditSearchResult = ({title, artist, date, tags}) => {
    return (
        <div>
            <ListGroup.Item>
                <InputGroup.Checkbox/>
                Monument Name
                {/* TODO: Display title, artist, date, and tags */}
            </ListGroup.Item>
        </div>
    )
}

export default BulkEditSearchResult
