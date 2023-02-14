import React, {useContext, useState} from 'react'
import { Field, FieldArray, Formik, useFormikContext } from "formik";
import {Card, Form} from "react-bootstrap";
import validator from "validator/es";

import './Queue.scss'
import QueuePanelBtns from "./QueuePanelBtns";
import QueueItemField from "./QueueItemField";
import QueueItemTags from "./QueueItemTags";
import QueueItemCoords from "./QueueItemCoords";
import QueueItemAddress from "./QueueItemAddress";
import QueueItemRefs from "./QueueItemRefs";
import QueueItemGallery from "./QueueItemGallery";
import {QueueResetContext} from "../../../../utils/queue-util";

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

// TODO: Add useFormikContext, pass reset func to QueueResetContext
const QueueItem = (props) => {
    const { dequeue, saveMonument, data } = props

    const [showCoords, setShowCoords] = useState(false)
    // const resetContext = useContext(QueueResetContext)

    const handleSubmit = async (values) => {
        saveMonument(values);
    }

    const toggleCoords = () => {
        setShowCoords(!showCoords)
    }

    const checkForFutureDate = (value) => {
        const now = Date.now()
        const valueDate = Date.parse(value)
        if (valueDate < now) {
            return false
        }
        return true
    }

    const handleValidate = (value, field) => {
        let error
        switch (field) {
            case 'createdDate':
                if (!validator.isDate(value.slice(0, 10))) error = 'Required'
                if (checkForFutureDate(value)) error = 'Future date is invalid'
                break
            case 'coordinates':
                let coordinates = [value.coordinates[1], value.coordinates[0]].join()

                if (!validator.isLatLong(coordinates))
                    error = 'Invalid Coordinates'
                break
            case 'images':
                for (let {url} of value) if (!validator.isURL(url, {allow_underscores: true}))
                    error = 'Invalid URL'
                break
            default:
                if (value == null || validator.isEmpty(value)) error = 'Required'
                break
        }

        return error
    }

    const getMonumentData = () => {
        let { contributions, ...monument } = props.data;
        return monument;
    }

    function afterSubmission(event) {
        event.preventDefault();
    }

    return (
        <Card className="queue-item">
            <Card.Body>
                <Formik 
                    initialValues={getMonumentData()}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    { (form) => 
                        <Form
                            onSubmit={form.handleSubmit}
                        >
                            {/* Images */}
                            <FieldArray name="images" component={QueueItemGallery}/>

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
                                // TODO: Add validation, conversion func
                                <Field {...{name: 'coordinates', text: 'Coordinates', type: 'text'}}
                                    toggle={toggleCoords}
                                    component={QueueItemCoords}
                                />
                            ) : (
                                // Address
                                // TODO: Add validation, conversion func
                                <Field {...{name: 'address', text: 'Address', type: 'text'}}
                                    toggle={toggleCoords}
                                    component={QueueItemAddress}
                                />
                            )}

                            {/* References */}
                            <FieldArray name="references" component={QueueItemRefs}/>

                            {/* Tags */}
                            <FieldArray name="monumentTags" component={QueueItemTags}/>
                            <QueuePanelBtns dq={() => dequeue(props.data.id)} active={data}/>
                        </Form>
                    }
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default QueueItem
