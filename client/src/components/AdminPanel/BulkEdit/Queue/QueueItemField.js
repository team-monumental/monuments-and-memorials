import React from 'react'
import {Form} from "react-bootstrap";

const QueueItemField = ({field, form: {touched, errors}, ...props}) => {
    return (
        <Form.Group>
            <Form.Label>{props.text}</Form.Label>
            <Form.Control {...field} {...props}
                          value={props.type === 'date' ? field.value.slice(0, 10) : (field?.value || '')}
                          isInvalid={!!errors[field.name]}
                          isValid={touched[field.name] && !errors[field.name]}
            />
            <Form.Control.Feedback type="invalid">{errors[field.name]}</Form.Control.Feedback>
        </Form.Group>
    )
}

export default QueueItemField
