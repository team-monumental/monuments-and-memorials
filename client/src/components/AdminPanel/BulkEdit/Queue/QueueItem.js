import React, {useEffect, useState} from 'react'
import {Card, Col, Container, Form, Row} from "react-bootstrap";

import QueueItemTags from "./QueueItemTags";

import {states} from "../../../../utils/queue-util";

import './Queue.scss'

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
                                    <Form.Control type="text" value={data.title} onChange={event => {
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
                                    <Form.Control type="text" value={data.artist} onChange={event => {
                                        handleDataChange('artist', event.target.value)
                                    }}/>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                {/* Created Date */}
                                <Form.Group>
                                    <Form.Label>Date Created</Form.Label>
                                    <Form.Control type="date" value={data.createdDate.slice(0, 10)} onChange={event => {
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
                                    <Form.Control type="text" value={data.city} onChange={event => {
                                        handleDataChange('artist', event.target.value)
                                    }}/>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                {/* State */}
                                {/* TODO: Update data on change */}
                                <Form.Group>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control as="select" onChange={event => {
                                        handleDataChange('state', event.target.value)
                                    }}>
                                        {Object.keys(states).map((state, idx) => (
                                            <option key={`state-opt-${idx}`}
                                                    value={state}
                                                    selected={data.state === state}>
                                                {states[state]}
                                            </option>
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
                                    <Form.Control type="text" value={data.address} onChange={event => {
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
                                    <Form.Control type="text" defaultValue={data.coordinates}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* Contributors */}
                                {/* TODO: Update data on change */}
                                <Form.Group>
                                    <Form.Label>Contributions</Form.Label>
                                    <Form.Control type="text" defaultValue={data.contributions}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* References */}
                                {/* TODO: Update data on change */}
                                <Form.Group>
                                    <Form.Label>References</Form.Label>
                                    <Form.Control type="text" defaultValue={data.references}/>
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
