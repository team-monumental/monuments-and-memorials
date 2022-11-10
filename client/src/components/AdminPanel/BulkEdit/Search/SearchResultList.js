import { StepFunctions } from 'aws-sdk';
import React, {useEffect, useState} from 'react'
import {Col, Container, InputGroup, ListGroup, Row} from "react-bootstrap";

import SearchResult from "./SearchResult";
import SearchResultNav from "./SearchResultNav";

const SearchResultList = ({results, enqueue, dequeue}) => {
    const [checked, setChecked] = useState(false)
    const [items, setItems] = useState([])

    const [active, setActive] = useState(0)
    const [step, setStep] = useState(10)

    const pageEnd = Math.min((step * (active)) + step, results.length)
    const pageStart = Math.min((step * (active)) + 1, pageEnd)

    const toggleChecked = () => {
        setChecked(!checked)
    }

    //populate new results after an update from the queue
    useEffect(() => {
        setItems(results)
    }, [results])

    return (
        <>
            <ListGroup as="ol" variant="flush">
                <p>Showing {pageStart} - {pageEnd} of {results.length} results</p>
                <ListGroup.Item as="li">
                    <Container fluid>
                        <Row>
                            <Col lg={1}><InputGroup.Checkbox checked={checked} onChange={toggleChecked}/></Col>
                            <Col lg={1}><span>ID</span></Col>
                            <Col lg={3}><span>NAME</span></Col>
                            <Col lg={2}><span>ARTIST</span></Col>
                            <Col lg={2}><span>STATE</span></Col>
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
            <SearchResultNav results={results} setItems={setItems} setActive={setActive} active={active} setStep={setStep} step={step}/>
        </>
    )
}

export default SearchResultList
