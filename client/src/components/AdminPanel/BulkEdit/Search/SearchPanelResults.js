import React from 'react';
import {Col, Container, ListGroup, Row} from "react-bootstrap";
import BulkEditSearchResult from "./BulkEditSearchResult";

const BulkEditSearchResults = ({results}) => {
    return (
        <ListGroup as="ol" variant="flush">
            <ListGroup.Item as="li">
                <Container>
                    <Row>
                        <Col lg={{span: 3, offset: 1}}><span>NAME</span></Col>
                        <Col lg={2}><span>ARTIST</span></Col>
                        <Col lg={3}><span>TAGS</span></Col>
                        <Col lg={2}><span>DATE CREATED</span></Col>
                    </Row>
                </Container>
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
