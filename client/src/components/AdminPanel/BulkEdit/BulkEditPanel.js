import React, {createContext, useCallback, useEffect, useState} from 'react'
import {Card, Col, Container, Row} from "react-bootstrap";

import SearchPanel from "./Search/SearchPanel";
import SearchPanelBtns from "./Search/SearchPanelBtns";
import QueuePanel from "./Queue/QueuePanel";


import SearchResultContext from "../../../utils/search-util";

import './BulkEdit.scss'
import {QueueResetContext} from "../../../utils/queue-util";
import { post, put } from '../../../utils/api-util';
import EditHistoryPanel from './History/EditHistoryPanel';

const BulkEditPanel = (props) => {
    // Hook for maintaining search results state
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const [queueList, setQueueList] = useState([])
    const [editHistoryList, setEditHistoryList] = useState([])
    const [active, setActive] = useState(null)

    const handleSearch = useCallback(() => {
        // TODO: Search with filters and update state
        let endpoint = `${window.location.origin}/api/search/monuments/?cascade=true&d=25&limit=25&page=1&q=${searchTerm}`

        fetch(endpoint)
            .then(res => res.json())
            .then(json => setSearchResults(json))
            .finally()
    }, [searchTerm])

    const saveMonument = async (monument) => {
        put(`${window.location.origin}/api/monument/bulkupdate/${monument.id}`, monument)
        .then(() => {
            dequeue(monument.id)
            const oldMonument = searchResults.find(mon => mon.id == monument.id)
            var diffArray = [];
            for(let key in monument){
                if(monument[key]  !== oldMonument[key] ){
                  diffArray.push(key);
                }
            }
            monument.changedFields = diffArray
            setEditHistoryList(history => ([...history, monument]))
            let updatedSearchResult = searchResults
            //find the old monument in the list and replace it with the updated one
            updatedSearchResult[searchResults.indexOf(searchResults.find(mon => mon.id == monument.id))] = monument
            setSearchResults(updatedSearchResult)
            props.showSuccessToast();
        })
        .catch(error => {
            console.log(error)
            props.showErrorToast();
        })
    }

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
        if(searchTerm.length !== 0) {
            handleSearch()
        } else {
            setSearchResults([])
        }
    }, []);

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
                <QueueResetContext.Provider value={() => {}}>
                    <Col lg={4}>
                        {/* Queue Panel card */}
                        <Card>
                            <Card.Header>
                                <Card.Title>
                                    Editing Queue
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <QueuePanel queue={queueList} active={active} setActive={setActive} saveMonument={saveMonument}/>
                            </Card.Body>
                        </Card>
                        {/* FIXME: De-queuing doesn't uncheck search result */}
                        
                    </Col>
                    <Col lg={5}>
                        <EditHistoryPanel editHistoryList={editHistoryList}/>
                    </Col>
                </QueueResetContext.Provider>
            </Row>
        </Container>
    )
}

export default BulkEditPanel
