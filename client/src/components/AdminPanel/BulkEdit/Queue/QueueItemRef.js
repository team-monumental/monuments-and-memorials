import React, {useEffect, useState} from "react";
import {Button, Form, InputGroup} from "react-bootstrap";

const QueueItemRef = ({field, form: {touched, errors}, ...props}) => {
    const [error, setError] = useState('')
    const [touch, setTouch] = useState(false)

    // Update touched
    useEffect(() => {
        if (touched.references)
            setTouch(true)
    }, [touched])

    // Update errors
    useEffect(() => {
        if (errors.references && typeof errors.references[props.idx] !== 'undefined') {
            setError(errors.references[props.idx].url)
        } else
            setError('')
    }, [errors])

    // TODO: Add top margin for not first nth children
    return (
        <InputGroup>
            <Form.Control {...field} type="text" value={field.value} isValid={touch && !error} isInvalid={!!error}/>
            <InputGroup.Append>
                <Button className="material-icons" variant="outline-danger" onClick={() => props.remove(props.idx)}>
                    delete
                </Button>
            </InputGroup.Append>
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </InputGroup>
    )
}

export default QueueItemRef
