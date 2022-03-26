import React from 'react'
import {Form} from "react-bootstrap";

const QueueItemField = ({name, text, type, value, onChange}) => {
    const getField = () => {
        switch (type) {
            case 'date':
                return (
                    <Form.Group>
                        <Form.Label>{text}</Form.Label>
                        <Form.Control name={name}
                                      type={type}
                                      value={value.slice(0, 10)}
                                      onChange={event => onChange(name, event.target.value)}/>
                    </Form.Group>
                )
            case 'text':
                return (
                    <Form.Group>
                        <Form.Label>{text}</Form.Label>
                        <Form.Control name={name}
                                      type={type}
                                      value={value}
                                      onChange={event => onChange(name, event.target.value)}/>
                    </Form.Group>
                )
        }
    }

    return getField()
}

export default QueueItemField
