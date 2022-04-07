import React, {useState} from 'react'
import {Field, FieldArray, Formik} from "formik";
import {Card, Form} from "react-bootstrap";
import validator from "validator/es";

import './Queue.scss'
import QueueItemField from "./QueueItemField";
import QueueItemTags from "./QueueItemTags";
import QueueItemCoords from "./QueueItemCoords";
import QueueItemAddress from "./QueueItemAddress";
import QueueItemRefs from "./QueueItemRefs";

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
    }
]

const QueueItem = (props) => {
    const [showCoords, setShowCoords] = useState(false)

    const handleSubmit = (values) => {
        console.log(values)
    }

    const toggleCoords = () => {
        setShowCoords(!showCoords)
    }

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
                        {/* Name, Artist, Date */}
                        {FIELDS.map(({name, text, type}) => {
                            return (
                                <Field {...{name, text, type}}
                                       key={`${name}Field`}
                                       validate={value => {
                                           return handleValidate(value, name)
                                       }}
                                       component={QueueItemField}/>
                            )
                        })}

                        {showCoords ? (
                            // Coordinates
                            // TODO: Add validation
                            <Field {...{name: 'coordinates', text: 'Coordinates', type: 'text'}}
                                   toggle={toggleCoords}
                                   component={QueueItemCoords}
                            />
                        ) : (
                            // Address
                            // TODO: Add validation
                            <Field {...{name: 'address', text: 'Address', type: 'text'}}
                                   toggle={toggleCoords}
                                   component={QueueItemAddress}
                            />
                        )}

                        {/* References */}
                        {/* TODO: Add validation */}
                        <FieldArray name="references">
                            {(helpers) => (
                                <QueueItemRefs {...helpers} refs={props.data.references} text={'References'}/>
                            )}
                        </FieldArray>

                        {/* Tags */}
                        {/* TODO: Add validation */}
                        <Field {...{name: 'monumentTags', text: 'Tags', type: 'text'}}
                               component={QueueItemTags}/>
                    </Form>
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default QueueItem
