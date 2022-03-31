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

    // TODO: Parse respective values correctly (obj, arr, str)
    const handleValidate = (value, field) => {
        let error

        switch (field) {
            case 'createdDate':
                if (validator.isDate(value)) error = 'Required'
                break
            case 'coordinates':
                // if (!validator.isLatLong(value, {checkDMS: true})) error = 'Invalid format'
                break
            case 'references':
                // if (!validator.isFQDN(value)) error = 'Invalid format'
                break
            case 'images':
                if (!validator.isFQDN(value)) error = 'Invalid format'
                break
            default:
                if (!validator.isEmpty(value)) error = 'Required'
                break
        }

        console.info(field, error)

        return error
    }

    const testValidate = (value) => {
        return !value ? 'Required': ''
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
                                   validate={testValidate}
                                   component={QueueItemField}/>
                        ))}
                    </Form>
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default QueueItem
