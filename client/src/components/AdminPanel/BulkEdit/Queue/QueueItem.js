import React, {useEffect, useState} from 'react'
import {Card, Col, Container, Form, Row} from "react-bootstrap";

import './Queue.scss'

import {states} from "../../../../utils/queue-util";
import Tag from "../../../Tags/Tag/Tag";
import QueueItemTags from "./QueueItemTags";

const QueueItem = (props) => {
    const [data, setData] = useState(props.data)

    const handleDataChange = (field, value) => {
        setData(data => ({...data, [field]: value}))
    }

    // TODO: Add/remove tag based on selection status
    const handleTagChange = () => {

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
                                    <Form.Control
                                        type="text"
                                        value={data.title}
                                        placeholder={"placeholder text"}
                                        onChange={event => {
                                            handleDataChange('title', event.target.value)
                                        }}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                {/* Artist */}
                                <Form.Group>
                                    <Form.Label>Artist</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.artist}
                                        placeholder={"placeholder text"}
                                        onChange={event => {
                                            handleDataChange('artist', event.target.value)
                                        }}/>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                {/* Created Date */}
                                <Form.Group>
                                    <Form.Label>Date Created</Form.Label>
                                    <Form.Control type="date"
                                                  value={data.createdDate.slice(0, 10)}
                                                  placeholder={"placeholder text"}
                                                  onChange={event => {
                                                      handleDataChange('createdDate', event.target.value)
                                                  }}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                {/* City */}
                                <Form.Group>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text"
                                                  value={data.city}
                                                  placeholder={"placeholder text"}
                                                  onChange={event => {
                                                      handleDataChange('artist', event.target.value)
                                                  }}/>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                {/* State */}
                                {/* TODO: Update data on change */}
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
                                    <Form.Control type="text"
                                                  value={data.address}
                                                  placeholder={"placeholder text"}
                                                  onChange={event => {
                                                      handleDataChange('address', event.target.value)
                                                  }}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* Coordinates */}
                                {/* TODO: Update data on change */}
                                <Form.Group>
                                    <Form.Label>Coordinates</Form.Label>
                                    <Form.Control type="text"
                                                  value={data.coordinates}
                                                  placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* Contributors */}
                                {/* TODO: Update data on change */}
                                <Form.Group>
                                    <Form.Label>Contributions</Form.Label>
                                    <Form.Control type="text"
                                                  value={data.contributions}
                                                  placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* References */}
                                {/* TODO: Update data on change */}
                                <Form.Group>
                                    <Form.Label>References</Form.Label>
                                    <Form.Control type="text"
                                                  value={data.references}
                                                  placeholder={"placeholder text"}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* Tags */}
                                <Form.Group>
                                    <Form.Label>Tags</Form.Label>
                                    <QueueItemTags tags={data.monumentTags} handleChange={handleTagChange}/>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default QueueItem
