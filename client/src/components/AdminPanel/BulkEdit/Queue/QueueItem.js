import React, {useContext, useState} from 'react'
import { Field, FieldArray, Formik, useFormikContext } from "formik";
import {Card, Button, Col, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import validator from "validator/es";

import './Queue.scss'
import QueuePanelBtns from "./QueuePanelBtns";
import QueueItemField from "./QueueItemField";
import QueueItemTags from "./QueueItemTags";
import QueueItemAddress from "./QueueItemAddress";
import QueueItemRefs from "./QueueItemRefs";
import QueueItemGallery from "./QueueItemGallery";
import QueueItemLat from "./QueueItemLat";
import QueueItemLong from "./QueueItemLong"
import {QueueResetContext} from "../../../../utils/queue-util";

let latLngRegex = /^[-]?(([0-8]?[0-9])(\.[0-9]{1,20})?|90(\.0{1,20})?)$/;

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

    const handleValidate = (value, field) => {
        let error
        switch (field) {
            case 'createdDate':
                if (!validator.isDate(value.slice(0, 10))) error = 'Required'
                break
            case 'lat':
                if (!latLngRegex.test(value)) error = 'Incorrect formatted latitude'
                break
            case 'lon' : 
                if (!latLngRegex.test(value)) error = 'Incorrect formatted longitude'
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
                                <><Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>{props.text}</Form.Label>
                                        <InputGroup hasValidation>
                                            <Field {...{ name: 'lat', text: 'Latitude', type: 'number' }}
                                                key={`latField`}
                                                validate={value => {
                                                    return handleValidate(value, 'lat');
                                                } }
                                                component={QueueItemLat} 
                                            />
                                            <Field {...{ name: 'lon', text: 'Longitude', type: 'number' }}
                                                key={`lonField`}
                                                validate={value => {
                                                    return handleValidate(value, 'lon');
                                                } }
                                                component={QueueItemLong} 
                                            />
                                            <InputGroup.Append>
                                                <OverlayTrigger placement="bottom" overlay={(
                                                    <Tooltip id="coords-toggle">
                                                        Swap to Address
                                                    </Tooltip>
                                                )}>
                                                    <Button className="material-icons" onClick={toggleCoords}>swap_vert</Button>
                                                </OverlayTrigger>
                                            </InputGroup.Append>
                                        </InputGroup>
                                        {/* TODO: Convert coordinates to address */}
                                        <Form.Text className="text-muted">Address: {data.address ? data.address : ''}</Form.Text>
                                    </Form.Group>
                                </Form.Row></>
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
