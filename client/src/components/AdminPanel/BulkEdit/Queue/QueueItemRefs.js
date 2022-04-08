import React from "react";
import {Field} from "formik";
import QueueItemRef from "./QueueItemRef";
import {Col, Form} from "react-bootstrap";


const QueueItemRefs = ({form: {values}, remove, push, ...props}) => {
    return (
        <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>References</Form.Label>
                {values.references.map((ref, idx) => (
                    <Field {...{idx: idx, remove: remove}} key={`ref-${idx}`}
                           name={`references.${idx}.url`}
                           type="text"
                           component={QueueItemRef}/>
                ))}
            </Form.Group>
        </Form.Row>
    )
}

export default QueueItemRefs
