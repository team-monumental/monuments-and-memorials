import React from 'react'
import {Col, Container, InputGroup, ListGroup, Row} from "react-bootstrap";
import Tag from "../../../Tags/Tag/Tag";
import './Search.scss'
import SearchResultBtns from "./SearchResultBtns";

// TODO: Apply CSS classes to format
const SearchResult = ({title, artist, date, tags}) => {
    return (
        <ListGroup.Item as="li">
            <Container fluid>
                <Row>
                    <Col lg={1}><InputGroup.Checkbox/></Col>
                    <Col lg={3}><span>{title}</span></Col>
                    <Col lg={2}><span>{artist}</span></Col>
                    <Col lg={3}>
                        <div className="tags-list">
                            {tags.map(tag => (
                                <Tag name={tag} selectable={false} selectedIcon={null} isMaterial={false}/>
                            ))}
                        </div>
                    </Col>
                    <Col lg={2}><span>{date}</span></Col>
                    <Col lg={1}>
                        <SearchResultBtns/>
                    </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    )
}

export default SearchResult
