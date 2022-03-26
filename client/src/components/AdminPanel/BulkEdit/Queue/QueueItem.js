import React, {useEffect, useState} from 'react'
import {Card, Col, Container, Form, Row} from "react-bootstrap";
import validator from "validator/es";

import QueueItemTags from "./QueueItemTags";

import './Queue.scss'
import {useFormik} from "formik";
import QueueItemField from "./QueueItemField";

const FIELDS = [
    {
        name: 'title',
        text: 'Title',
        type: 'text'
    },
    {
        name: 'artist',
        text: 'Artist',
        type: 'text'
    },
    {
        name: 'createdDate',
        text: 'Date Created',
        type: 'date'
    },
    {
        name: 'address',
        text: 'Address',
        type: 'text'
    },
    {
        name: 'coordinates',
        text: 'Coordinates',
        type: 'text'
    },
    {
        name: 'references',
        text: 'References',
        type: 'text'
    }
]

const QueueItem = (props) => {
    const [data, setData] = useState(props.data)

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

    const handleDataChange = (field, value) => {
        // if (validateDataChange(field, value)) setData(data => ({...data, [field]: value}))

        setData(data => ({...data, [field]: value}))
    }

    // TODO: Add/remove tag based on selection status
    const handleTagChange = () => {

    }

    const validateDataChange = (field, value) => {
        switch (field) {
            case 'title':
                return !validator.isEmpty(value)
            case 'artist':
                return !validator.isEmpty(value)
            case 'createdDate':
                return validator.isDate(value)
            case 'address':
                return !validator.isEmpty(value)
            case 'coordinates':
                return validator.isLatLong(value, {checkDMS: true})
            case 'references':
                return validator.isFQDN(value)
            case 'images':
                return validator.isFQDN(value)
            case 'tags':
                return !validator.isEmpty(value)
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
                <Form noValidate onSubmit={formik.handleSubmit}>
                    <Container fluid>
                        {FIELDS.map(field => (
                            <Row key={`${field.name}FieldRow`}>
                                <Col>
                                    <QueueItemField name={field.name}
                                                    text={field.text}
                                                    type={field.type}
                                                    value={data[field.name]}
                                                    onChange={handleDataChange}/>
                                </Col>
                            </Row>
                        ))}
                        {/* TODO: Create custom rows for coordinates, references */}
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
