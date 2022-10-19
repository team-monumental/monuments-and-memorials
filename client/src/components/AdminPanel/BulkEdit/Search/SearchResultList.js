import React, {useEffect, useState} from 'react'
import {Col, Container, InputGroup, ListGroup, Row} from "react-bootstrap";

import SearchResult from "./SearchResult";
import SearchResultNav from "./SearchResultNav";

const SearchResultList = ({results, enqueue, dequeue}) => {
    const [checked, setChecked] = useState(false)
    const [items, setItems] = useState([])

    const toggleChecked = () => {
        setChecked(!checked)
    }

    useEffect(() => {
        setItems(results)
    }, [results])

    return (
        <>
            <ListGroup as="ol" variant="flush">
                <ListGroup.Item as="li">
                    <Container fluid>
                        <Row>
                            <Col lg={1}><InputGroup.Checkbox checked={checked} onChange={toggleChecked}/></Col>
                            <Col lg={3}><span>NAME</span></Col>
                            <Col lg={2}><span>ARTIST</span></Col>
                            <Col lg={2}><span>TAGS</span></Col>
                            <Col lg={2}><span>DATE CREATED</span></Col>
                        </Row>
                    </Container>
                </ListGroup.Item>
                {items.map((item, idx) => (
                    <SearchResult
                        key={`search-result-${idx}`}
                        data={item}
                        nq={enqueue}
                        dq={dequeue}
                        selected={checked}
                    />
                ))}
            </ListGroup>
            <SearchResultNav results={results} setItems={setItems}/>
        </>
    )
}

export default SearchResultList
