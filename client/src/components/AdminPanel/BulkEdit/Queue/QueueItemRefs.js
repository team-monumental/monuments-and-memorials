import React from "react";
import {Form} from "react-bootstrap";


const QueueItemRefs = ({field, form: {touched, errors}, ...props}) => {
    // TODO: Integrate Formik FieldArray
    return (
        <Form.Group>
            <Form.Label>{props.text}</Form.Label>
            {field.value.map(ref => (
                <Form.Control key={`ref${ref.id}`} type="text" defaultValue={ref.url}/>
            ))}
        </Form.Group>
    )
}

export default QueueItemRefs
