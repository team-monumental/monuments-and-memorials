import React, {useEffect} from "react";
import {Button, Form, InputGroup} from "react-bootstrap";
import {Field} from "formik";


const QueueItemRefs = ({insert, remove, push, form: {values: {references}}, ...props}) => {
    const Ref = ({id, url, idx}) => (
        <InputGroup>
            <Form.Control key={`ref${id}`} type="text" defaultValue={url}/>
            <InputGroup.Append>
                <Button className="material-icons" variant="outline-danger" onClick={() => remove(idx)}>delete</Button>
            </InputGroup.Append>
        </InputGroup>
    )

    return (
        <Form.Group>
            <Form.Label>{props.text}</Form.Label>
            {references.map((ref, idx) => (
                <Field key={`ref-${idx}`} id={ref.id} url={ref.url} idx={idx} component={Ref}/>
            ))}
        </Form.Group>
    )
}

export default QueueItemRefs
