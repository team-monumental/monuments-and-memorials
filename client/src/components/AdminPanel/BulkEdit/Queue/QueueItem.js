import React, {useEffect, useState} from 'react'

import './Queue.scss'

import "react-datepicker/dist/react-datepicker.css";
import {Card, Col, Container, Form, Row} from "react-bootstrap";
import {states} from "../../../../utils/queue-util";

const QueueItem = (props) => {
    const [data, setData] = useState(props.data)

    const handleDataChange = (field, value) => {
        setData(data => ({...data, [field]: value}))
    }

    // Update the internal state when the "active" record changes (from props)
    useEffect(() => {
        setData(props.data)
    }, [props.data])

    return (
        <Card className="queue-item">
            {/* TODO: Implement multiple images (carousel?) */}
            <Card.Img alt="placeholder img"/>
            <Card.Body>
                <Form>
                    <Container fluid>
                        <Row>
                            <Col>
                                {/* Title */}
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" value={data.title}
                                                  placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                {/* Artist */}
                                <Form.Group>
                                    <Form.Label>Artist</Form.Label>
                                    <Form.Control type="text" value={data.artist}
                                                  placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                {/* Created Date */}
                                <Form.Group>
                                    <Form.Label>Date Created</Form.Label>
                                    <Form.Control type="date" value={data.createdDate.slice(0, 10)}
                                                  onChange={event => {
                                                      handleDataChange('createdDate', event.target.value)
                                                  }} placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                {/* City */}
                                <Form.Group>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" value={data.city}
                                                  placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                {/* State */}
                                <Form.Group>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control as="select">
                                        {Object.keys(states).map((state, idx) => (
                                            <option key={`state-opt-${idx}`}
                                                    value={idx}>{states[state]}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* Address */}
                                <Form.Group>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" value={data.address}
                                                  placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* Coordinates */}
                                <Form.Group>
                                    <Form.Label>Coordinates</Form.Label>
                                    <Form.Control type="text" value={data.coordinates}
                                                  placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* Contributors */}
                                <Form.Group>
                                    <Form.Label>Contributions</Form.Label>
                                    <Form.Control type="text" value={data.contributions}
                                                  placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* References */}
                                <Form.Group>
                                    <Form.Label>References</Form.Label>
                                    <Form.Control type="text" value={data.references}
                                                  placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/*<Row>*/}
                        {/*    <Col>*/}
                        {/*        {tags.map(tag => <Tag name={tag.name} selectable={true} isMaterial={tag.isMaterial}/>)}*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                    </Container>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default QueueItem
