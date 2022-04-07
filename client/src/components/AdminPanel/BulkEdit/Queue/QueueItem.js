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
        type: 'refs'
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

        switch (field) {
            case 'createdDate':
                if (!validator.isDate(value.slice(0, 10))) error = 'Required'
                break
            case 'coordinates':
                let coordinates = [value.coordinates[1], value.coordinates[0]].join()

                if (!validator.isLatLong(coordinates))
                    error = 'Invalid Coordinates'
                break
            case 'references':
                for (let {url} of value) {
                    if (!validator.isURL(url, {allow_underscores: true}))
                        error = 'Invalid URL'
                }
                break
            case 'images':
                for (let {url} of value) if (!validator.isURL(url, {allow_underscores: true}))
                    error = 'Invalid URL'
                break
            case 'monumentTags':
                for (let {tag: {name}} of value)
                    if (validator.isEmpty(name)) error = 'Required'
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
                        {FIELDS.map(({name, text, type}) => {
                            console.info(type)

                            return (
                                <Field {...{name, text, type}}
                                       key={`${name}Field`}
                                       validate={value => {
                                           return handleValidate(value, name)
                                       }}
                                       component={QueueItemField}/>
                            )
                        })}
                    </Form>
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default QueueItem
