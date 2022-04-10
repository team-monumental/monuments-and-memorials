import React, {useState} from "react";
import {Field} from "formik";
import QueueItemRef from "./QueueItemRef";
import {Button, Col, Form} from "react-bootstrap";
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
        <Form.Group>
            <Form.Label>References</Form.Label>
            <div className="refs-list">
                {values.references.map((ref, idx) => (
                    <Field {...{idx, remove}} key={`ref-${idx}`}
                           name={`references.${idx}.url`}
                           type="text"
                           validate={validateRef}
                           component={QueueItemRef}/>
                ))}
            </div>
            {/*<Form.Text><a href="#" onClick={handlePush}>add reference</a></Form.Text>*/}
            <Button block size="sm" variant="outline-primary" className="material-icons"
                    onClick={handlePush}>add</Button>
        </Form.Group>
    )
}

export default QueueItemRefs
