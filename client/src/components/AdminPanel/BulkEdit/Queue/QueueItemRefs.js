import React from "react";
import {Form} from "react-bootstrap";


const QueueItemRefs = ({refs}) => {
    // TODO: Integrate Formik FieldArray
    return (
        <Form.Group>
            {refs.map(ref => (
                <Form.Control key={`ref${ref.id}`} type="text" defaultValue={ref.url}/>
            ))}
        </Form.Group>
    )
}

export default QueueItemRefs
