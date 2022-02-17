import React, {useState} from 'react';
import {Col, Container, InputGroup, ListGroup, Row} from "react-bootstrap";
import SearchResult from "./SearchResult";

const SearchResultList = ({results, enqueue, dequeue}) => {
    const [checked, setChecked] = useState(false)

    const toggleChecked = () => {
        setChecked(!checked)
    }

    return (
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
            {results.map(result => (
                <SearchResult
                    data={result}
                    nq={enqueue}
                    dq={dequeue}
                    selected={checked}
                />
            ))}
        </ListGroup>
    )
}

export default SearchResultList
