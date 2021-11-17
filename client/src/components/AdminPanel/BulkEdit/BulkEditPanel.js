import React, {useState} from 'react'
import {Card, Col, Container, Row} from "react-bootstrap";
import BulkEditSearchPanel from "./BulkEditSearchPanel";

import './BulkEdit.scss'
import BulkEditUpdateForm from "./Queue/BulkEditUpdateForm";

// Placeholder search results
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

const BulkEditPanel = (props) => {
    // Hook for maintaining search results state
    const [searchResults, setSearchResults] = useState(placeholderResults)

    const handleSearch = () => {
        // TODO: Search with filters and update state
    }

    return (
        <div className="bulk-edit">
            <Container>
                <Row>
                    <Col lg={6}>
                        {/* Search Panel card */}
                        <Card>
                            <Card.Header>
                                <Card.Title>
                                    Bulk Edit Monuments and Memorials
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <BulkEditSearchPanel results={searchResults} handleSearch={handleSearch}/>
                            </Card.Body>
                        </Card>
                        {/* TODO: Search panel buttons here */}
                    </Col>
                    <Col lg={6}>
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
        </div>
    )
}

export default BulkEditPanel
