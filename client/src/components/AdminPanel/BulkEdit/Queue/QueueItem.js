import React, {useEffect, useState} from 'react'
import {Card, Col, Container, Form, Row} from "react-bootstrap";
import validator from "validator/es";

import QueueItemTags from "./QueueItemTags";

import './Queue.scss'
import {useFormik} from "formik";

const QueueItem = (props) => {
    const [data, setData] = useState(props.data)
    const [fields, setFields] = useState(null)

    // TODO: Init Formik
    const formik = useFormik({
        initialValues: data,
        handleChange: (event) => {
            let field = event.target.name
            let value = event.target.value

            if (validateDataChange(field, value)) setData(data => ({...data, [field]: value}))
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2))
        }
    })

    const handleDataChange = (event, field, value) => {
        if (validateDataChange(field, value)) setData(data => ({...data, [field]: value}))
    }

    // TODO: Add/remove tag based on selection status
    const handleTagChange = () => {

    }

    const validateDataChange = (field, value) => {
        switch (field) {
            case 'title':
                return validator.isAlpha(value)
            case 'artist':
                return validator.isAlpha(value)
            case 'createdDate':
                return validator.isDate(value)
            case 'address':
                return validator.isAlpha(value)
            case 'coordinates':
                return validator.isLatLong(value, {checkDMS: true})
            case 'references':
                return validator.isFQDN(value)
            case 'images':
                return validator.isFQDN(value)
            case 'tags':
                return validator.isAlpha(value)
        }
    }

    // Update the internal state when the "active" record changes (from props)
    useEffect(() => {
        setData(props.data)
    }, [props.data])

    // TODO: Generate form fields, extract to component (?), add Formik validation to fields
    return (
        <Card className="queue-item">
            {/* TODO: Implement multiple image carousel (?) */}
            <Card.Img alt="placeholder img"/>
            <Card.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Container fluid>
                        <Row>
                            <Col>
                                {/* Title */}
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control name="title" type="text" value={data.title} onChange={event => {
                                        handleDataChange(event, 'title', event.target.value)
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
                                {/* TODO: Handle tag changes, add 'new tag' button */}
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
