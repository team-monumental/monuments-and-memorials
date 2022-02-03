import React, {useEffect, useState} from 'react'
import {Card, Col, Container, Row} from "react-bootstrap";

import QueuePanel from "./Queue/QueuePanel";
import SearchPanel from "./Search/SearchPanel";
import SearchPanelBtns from "./Search/SearchPanelBtns";

import './BulkEdit.scss'
import QueueContext from "../../../contexts/queue-context";

const BulkEditPanel = (props) => {
    // Hook for maintaining search results state
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState([])

    const [queueList, setQueueList] = useState([])

    const handleSearch = () => {

        // TODO: Search with filters and update state
        async function fetchMonuments() {
            const response = await fetch(window.location.origin + "/api/search/monuments/?cascade=true&d=25&limit=10&page=1&q=" + searchTerm);
            const json = await response.json();
            setSearchResults(json);
        }

        fetchMonuments().finally()

    }

    const enqueue = (recordData) => {
        setQueueList([...queueList, recordData])
    }

    const dequeue = (recordId) => {
        setQueueList(queueList.filter(record => record.id !== recordId))
    }

    const removeSearchResult = (recordId) => {
        setSearchResults(searchResults.filter(record => record.id !== recordId))
    }

    useEffect(() => {
        handleSearch()
    }, []);

    useEffect(() => {
        console.log(queueList)
    }, [queueList])

    return (
        <QueueContext.Provider value={{list: queueList, nq: enqueue, dq: dequeue}}>
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
                                <SearchPanel results={searchResults}
                                             enqueue={enqueue}
                                             dequeue={dequeue}
                                             handleSearch={handleSearch}
                                             onChange={e => setSearchTerm(e.target.value)}/>
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
                                <QueuePanel queue={queueList} dequeue={dequeue}/>
                            </Card.Body>
                        </Card>
                        {/* TODO: Queue panel buttons here */}
                    </Col>
                </Row>
            </Container>
        </QueueContext.Provider>
    )
}

export default BulkEditPanel
