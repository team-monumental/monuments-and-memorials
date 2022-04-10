import React, {useEffect, useState} from "react";
import {Button, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";

const QueueItemRef = ({field, form: {touched, errors}, remove, ...props}) => {
    const [error, setError] = useState('')
    const [touch, setTouch] = useState(false)

    // Update touched
    // FIXME: When valid ref is touched, new refs also appear valid/touched
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

    // noinspection JSValidateTypes,RequiredAttributes
    return (
        <InputGroup>
            <Form.Control {...field} type="text" value={field.value} isValid={touch && !error} isInvalid={!!error}/>
            <InputGroup.Append>
                <OverlayTrigger placement="bottom" overlay={(
                    <Tooltip id="coords-toggle">
                        Delete Reference
                    </Tooltip>)}>
                    <Button className="material-icons" variant="outline-danger"
                            onClick={() => remove(props.idx)}>delete</Button>
                </OverlayTrigger>
            </InputGroup.Append>
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </InputGroup>
    )
}

export default QueueItemRef
