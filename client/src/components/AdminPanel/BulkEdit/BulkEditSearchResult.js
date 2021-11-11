import React from 'react'
import {InputGroup, ListGroup} from "react-bootstrap";
import Tag from "../../Tags/Tag/Tag";

// TODO: Apply CSS classes to format
const BulkEditSearchResult = ({title, artist, date, tags}) => {
    return (
        <ListGroup.Item as="li">
            <InputGroup.Checkbox/>
            <p>{title}</p>
            <p>{artist}</p>
            <p>{date}</p>
            <div className="tags-list">{tags.map(tag => (<Tag name={tag} selectable={false} selectedIcon={null} isMaterial={false}/>))}</div>
            {/* TODO: Display title, artist, date, and tags */}
        </ListGroup.Item>
    )
}

export default BulkEditSearchResult
