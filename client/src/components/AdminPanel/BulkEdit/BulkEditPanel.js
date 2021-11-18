import React, {useEffect, useState} from 'react'
import {Card, Col, Container, Row} from "react-bootstrap";

import BulkEditUpdateForm from "./Queue/BulkEditUpdateForm";
import SearchPanel from "./Search/SearchPanel";
import SearchPanelBtns from "./Search/SearchPanelBtns";

import './BulkEdit.scss'

// Placeholder search results
const placeholderResults = [
    {
        artist: 'John Doe',
        createdDate: '01/01/2021',
        monumentTags: [{tag: {name: "Fake"}}, {tag: {name: "Real"}}, {tag: {name: "Yes"}}],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        createdDate: '01/01/2021',
        monumentTags: [{tag: {name: "Fake"}}, {tag: {name: "Real"}}, {tag: {name: "Yes"}}],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        createdDate: '01/01/2021',
        monumentTags: [{tag: {name: "Fake"}}, {tag: {name: "Real"}}, {tag: {name: "Yes"}}],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        createdDate: '01/01/2021',
        monumentTags: [{tag: {name: "Fake"}}, {tag: {name: "Real"}}, {tag: {name: "Yes"}}],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        createdDate: '01/01/2021',
        monumentTags: [{tag: {name: "Fake"}}, {tag: {name: "Real"}}, {tag: {name: "Yes"}}],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        createdDate: '01/01/2021',
        monumentTags: [{tag: {name: "Fake"}}, {tag: {name: "Real"}}, {tag: {name: "Yes"}}],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        createdDate: '01/01/2021',
        monumentTags: [{tag: {name: "Fake"}}, {tag: {name: "Real"}}, {tag: {name: "Yes"}}],
        title: 'Unknown'
    },
    {
        artist: 'John Doe',
        createdDate: '01/01/2021',
        monumentTags: [{tag: {name: "Fake"}}, {tag: {name: "Real"}}, {tag: {name: "Yes"}}],
        title: 'Unknown'
    }
]

const searchEndpoint = '/api/search/monuments/?cascade=true&d=25&limit=10&page=1'

const BulkEditPanel = (props) => {
    // Hook for maintaining search results state
    const [searchResults, setSearchResults] = useState([])

    useEffect(async () => {
        await handleSearch()
    }, []);

    const handleSearch = async () => {
        // TODO: Search with filters and update state
        const response = await fetch(window.location.origin + searchEndpoint);
        const json = await response.json();
        setSearchResults(json);
    }

    return (
        <Container className="bulk-edit" fluid>
            <Row>
                <Col lg={8}>
                    {/* Search Panel card */}
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                Bulk Edit Monuments and Memorials
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <SearchPanel results={searchResults} handleSearch={handleSearch}/>
                        </Card.Body>
                    </Card>
                    <SearchPanelBtns/>
                </Col>
                <Col lg={4}>
                    {/* Queue Panel card */}
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                Editing Queue
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {/* TODO: Will need to create a new component with less bloat */}
                            {/* TODO: Pass search results to queue panel component */}
                            <BulkEditUpdateForm/>
                        </Card.Body>
                    </Card>
                    {/* TODO: Queue panel buttons here */}
                </Col>
            </Row>
        </Container>
    )
}

export default BulkEditPanel
