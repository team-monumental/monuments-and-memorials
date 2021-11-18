import React from 'react';
import {Col, Container, ListGroup, Row} from "react-bootstrap";
import SearchResult from "./SearchResult";

const SearchResultList = ({results}) => {
    return (
        <ListGroup as="ol" variant="flush">
            <ListGroup.Item as="li">
                <Container fluid>
                    <Row>
                        <Col lg={{span: 3, offset: 1}}><span>NAME</span></Col>
                        <Col lg={2}><span>ARTIST</span></Col>
                        <Col lg={3}><span>TAGS</span></Col>
                        <Col lg={{span: 2, offset: -1}}><span>DATE CREATED</span></Col>
                    </Row>
                </Container>
            </ListGroup.Item>
            {results.map(result => (
                <SearchResult
                    title={result.title}
                    artist={result.artist}
                    date={result.createdDate}
                    tags={result.monumentTags.slice(0, 2).map(monumentTag => monumentTag.tag.name)}/>
            ))}
        </ListGroup>
    )
}

export default SearchResultList
