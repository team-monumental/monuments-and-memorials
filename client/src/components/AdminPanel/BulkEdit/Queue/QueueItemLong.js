import React, {useEffect} from "react";
import {Button, Col, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";

const QueueItemLong = ({field, form: {touched, errors, values}, ...props}) => {
    console.log('values', values)
    // noinspection JSValidateTypes,RequiredAttributes
    return (
        <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>{props.text}</Form.Label>
                <InputGroup hasValidation>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Longitude</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control {...field} value={values.lon}/>
                </InputGroup>
            </Form.Group>
        </Form.Row>
    )
}

export default QueueItemLong
