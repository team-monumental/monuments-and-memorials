import React, {useEffect, useState} from 'react';
import {Col, Container, InputGroup, ListGroup, Pagination, Row} from "react-bootstrap";

import SearchResult from "./SearchResult";

const SearchResultList = ({results, enqueue, dequeue}) => {
    const [checked, setChecked] = useState(false)
    const [active, setActive] = useState(0)
    const [step, setStep] = useState(5)
    const [items, setItems] = useState([])

    const toggleChecked = () => {
        setChecked(!checked)
    }

    const handleActive = (idx) => {
        setActive(idx)
    }

    useEffect(() => {
        setItems(results.slice(active * step, step + (active * step)))
    }, [results])

    useEffect(() => {
        setItems(results.slice(active * step, step + (active * step)))
    }, [active])

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
                {items.map((item) => (
                    <SearchResult
                        data={item}
                        nq={enqueue}
                        dq={dequeue}
                        selected={checked}
                    />
                ))}
            </ListGroup>
            <Pagination>
                <Pagination.First disabled={active === 0} onClick={() => handleActive(0)}/>
                <Pagination.Prev disabled={active === 0} onClick={() => handleActive(active - 1)}/>
                {Array.from({length: results.length / step}, (x, i) => i).map(idx =>
                    <Pagination.Item active={active === idx} onClick={() => setActive(idx)}>{idx + 1}</Pagination.Item>
                )}
                <Pagination.Next disabled={active === (results.length / step) - 1}
                                 onClick={() => handleActive(active + 1)}/>
                <Pagination.Last disabled={active === (results.length / step) - 1}
                                 onClick={() => handleActive((results.length / step) - 1)}/>
            </Pagination>
        </>
    )
}

export default SearchResultList
