import React, {useEffect} from "react";
import {Button, Col, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";


const QueueItemLat = ({field, form: {touched, errors, values}, ...props}) => {
    console.log('values', values)
    // noinspection JSValidateTypes,RequiredAttributes
    return (
        <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>{props.text}</Form.Label>
                <InputGroup hasValidation>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Latitude</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control {...field} value={values.lat}/>
                </InputGroup>
            </Form.Group>
        </Form.Row>
    )
}

export default QueueItemLat
