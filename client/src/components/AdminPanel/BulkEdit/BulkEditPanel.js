import React, {createContext, useCallback, useEffect, useState} from 'react'
import {Card, Col, Container, Row} from "react-bootstrap";
import * as QueryString from 'query-string';

import SearchPanel from "./Search/SearchPanel";
import SearchPanelBtns from "./Search/SearchPanelBtns";
import QueuePanel from "./Queue/QueuePanel";


import SearchResultContext from "../../../utils/search-util";

import './BulkEdit.scss'
import {QueueResetContext} from "../../../utils/queue-util";
import { post, put } from '../../../utils/api-util';
import EditHistoryPanel from './History/EditHistoryPanel';
import { pick } from 'query-string';

const BulkEditPanel = (props) => {
    // Hook for maintaining search results state
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const [queueList, setQueueList] = useState([])
    const [searchMode, setSearchMode] = useState("monument")
    const [editHistoryList, setEditHistoryList] = useState([])
    const [active, setActive] = useState(null)

    const handleSearch = useCallback(() => {
        // TODO: Search with filters and update state

        // IF SearchMode is true, it is the Monument search
        console.log(searchMode)
        let endpoint = searchMode == "monument" ? 
            `${window.location.origin}/api/search/monuments/?cascade=true&d=25&limit=25&page=1&q=${searchTerm}` : 
            `${window.location.origin}/api/search/user/monument/?name=${searchTerm}`


        fetch(endpoint)
            .then(res => res.json())
            .then(json => setSearchResults(json))
            .finally()
    }, [searchTerm])

    const handleSearchMode = (event) => {
        setSearchMode(event)
    }

    const saveMonument = async (monument) => {
        const oldMonument = searchResults.find(mon => mon.id == monument.id)
        const newTags = monument.monumentTags.map(elem => elem.tag.name);
        monument.monumentTags = oldMonument.monumentTags
        put(`${window.location.origin}/api/monument/bulkupdate/${monument.id}?newTagString=${encodeURIComponent(JSON.stringify(newTags))}`, monument)
        .then(() => {
            dequeue(monument.id)
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
            handleSearch();
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
    }, [searchTerm]);

    useEffect(() => {
        if(searchResults.length > 0 && searchTerm.length === 0) {
            setSearchResults([])
        }
    }, [searchResults]);

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
                                <SearchPanel 
                                    results={searchResults}
                                    enqueue={enqueue}
                                    dequeue={dequeue}
                                    handleSearch={handleSearch}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    queueList={queueList}
                                    handleSearchMode={handleSearchMode}
                                    currentSearchMode={searchMode}
                                />
                            </SearchResultContext.Provider>
                        </Card.Body>
                    </Card>
                    <SearchPanelBtns queueList={queueList} dequeue={dequeue} handleSearch={handleSearch}/>
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
                                <QueuePanel queue={queueList} dequeue={dequeue} active={active} setActive={setActive} saveMonument={saveMonument}/>
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
