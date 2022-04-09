import React, {useState} from "react";
import {Field} from "formik";
import QueueItemRef from "./QueueItemRef";
import {Col, Form} from "react-bootstrap";
import validator from "validator/es";


const QueueItemRefs = ({field, form: {values}, remove, push, ...props}) => {
    const [newRefId, setNewRefId] = useState(-1)

    const handlePush = () => {
        push({
            id: newRefId,
            createdDate: new Date(),
            lastModifiedDate: null,
            createdBy: null,
            url: ''
        })

        setNewRefId(newRefId - 1)
    }

    const validateRef = (value) => {
        return !validator.isURL(value, {allow_underscores: true}) ? 'Invalid URL' : ''
    }

    return (
        <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>References</Form.Label>
                {values.references.map((ref, idx) => (
                    <Field {...{idx: idx, remove: remove}} key={`ref-${idx}`}
                           name={`references.${idx}.url`}
                           type="text"
                           validate={validateRef}
                           component={QueueItemRef}/>
                ))}
                <Form.Text><a href="#" onClick={handlePush}>add reference</a></Form.Text>
            </Form.Group>
        </Form.Row>
    )
}

export default QueueItemRefs
