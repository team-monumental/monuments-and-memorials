import React, {useCallback, useEffect, useState} from 'react'
import {Card, Col, Container, Row} from "react-bootstrap";

import SearchPanel from "./Search/SearchPanel";
import SearchPanelBtns from "./Search/SearchPanelBtns";
import QueuePanel from "./Queue/QueuePanel";
import QueuePanelBtns from "./Queue/QueuePanelBtns";

import SearchResultContext from "../../../utils/search-util";

import './BulkEdit.scss'

const BulkEditPanel = (props) => {
    // Hook for maintaining search results state
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState([])

    const [queueList, setQueueList] = useState([])
    const [active, setActive] = useState(null)

    const handleSearch = useCallback(() => {
        // TODO: Search with filters and update state
        let endpoint = `${window.location.origin}/api/search/monuments/?cascade=true&d=25&limit=25&page=1&q=${searchTerm}`

        fetch(endpoint)
            .then(res => res.json())
            .then(json => setSearchResults(json))
            .finally()
    }, [searchTerm])

    const enqueue = (recordData) => {
        setQueueList(queue => ([...queue, recordData]))
    }

    const dequeue = (id) => {
        setQueueList(queue => ([...queue.filter(record => record.id !== id)]))
    }

    const deleteSearchResult = (recordId) => {
        setSearchResults(searchResults.filter(record => record.id !== recordId))
    }

    useEffect(() => {
        handleSearch()
    }, [handleSearch]);

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
                            <SearchResultContext.Provider value={deleteSearchResult}>
                                <SearchPanel results={searchResults}
                                             enqueue={enqueue}
                                             dequeue={dequeue}
                                             handleSearch={handleSearch}
                                             onChange={e => setSearchTerm(e.target.value)}
                                />
                            </SearchResultContext.Provider>
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
                            <QueuePanel queue={queueList} active={active} setActive={setActive}/>
                        </Card.Body>
                    </Card>
                    {/* FIXME: De-queuing doesn't uncheck search result */}
                    <QueuePanelBtns dq={() => dequeue(active.id)}/>
                </Col>
            </Row>
        </Container>
    )
}

export default BulkEditPanel
