import React from 'react'
import {Field, Formik} from "formik";
import {Card, Form} from "react-bootstrap";
import validator from "validator/es";

import './Queue.scss'
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
    },
    // {
    //     name: 'tags',
    //     text: 'Tags',
    //     type: 'tags'
    // }
]

const QueueItem = (props) => {
    const handleSubmit = (values) => {
        console.log(values)
    }

    // TODO: Add/remove tag based on selection status
    const handleTagChange = () => {

    }

    const handleValidate = (value, field) => {
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

        return {title: 'Required'}
    }

    const validate = (value) => {
        return !value ? 'Required' : ''
    }

    return (
        <Card className="queue-item">
            {/* TODO: Image carousel (?) */}
            <Card.Img alt="placeholder img"/>
            <Card.Body>
                <Formik initialValues={{...props.data}}
                        onSubmit={handleSubmit}>
                    <Form>
                        {FIELDS.map(({name, text, type}) => (
                            <Field key={`${name}Field`} {...{name, text, type}}
                                   validate={validate}
                                   component={QueueItemField}/>
                        ))}
                    </Form>
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default QueueItem
