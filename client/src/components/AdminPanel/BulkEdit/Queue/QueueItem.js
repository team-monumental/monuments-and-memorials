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
    {
        name: 'monumentTags',
        text: 'Tags',
        type: 'tags'
    }
]

const QueueItem = (props) => {
    const handleSubmit = (values) => {
        console.log(values)
    }

    // TODO: Add/remove tag based on selection status
    const handleTagChange = () => {

    }

    // TODO: Parse respective values correctly (obj, arr, str)
    const handleValidate = (value, field) => {
        let error

        console.info(`${field}: ${value}`)

        switch (field) {
            case 'createdDate':
                if (!validator.isDate(value.slice(0, 10))) error = 'Required'
                break
            case 'coordinates':
                // if (!validator.isLatLong(value, {checkDMS: true})) error = 'Invalid format'
                break
            case 'references':
                // if (!validator.isFQDN(value)) error = 'Invalid format'
                break
            case 'images':
                // if (!validator.isFQDN(value)) error = 'Invalid format'
                break
            case 'monumentTags':
                break
            default:
                if (validator.isEmpty(value)) error = 'Required'
                break
        }

        return error
    }

    return (
        <Card className="queue-item">
            {/* TODO: Image carousel (?) */}
            <Card.Img alt="placeholder img"/>
            <Card.Body>
                <Formik initialValues={{...props.data}}
                        onSubmit={handleSubmit} enableReinitialize>
                    <Form>
                        {FIELDS.map(({name, text, type}) => (
                            <Field {...{name, text, type}}
                                   key={`${name}Field`}
                                   validate={value => {
                                       return handleValidate(value, name)
                                   }}
                                   component={QueueItemField}/>
                        ))}
                    </Form>
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default QueueItem
