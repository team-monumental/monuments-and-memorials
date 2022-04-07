import React, {useState} from 'react'
import {Col, Form} from "react-bootstrap";

const QueueItemField = ({field, form: {touched, errors}, ...props}) => {
    return (
        <Form.Row>
            <Form.Group as={Col} controlId={`${field.name}Validation`}>
                <Form.Label>{props.text}</Form.Label>
                <Form.Control {...field} {...props}
                              value={props.type === 'date' ? field.value.slice(0, 10) : field.value}
                              isInvalid={!!errors[field.name]}
                              isValid={touched[field.name] && !errors[field.name]}
                />
                <Form.Control.Feedback type="invalid">{errors[field.name]}</Form.Control.Feedback>
            </Form.Group>
        </Form.Row>
    )
}

export default QueueItemField
