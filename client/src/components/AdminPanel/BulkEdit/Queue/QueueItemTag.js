import React, {useEffect, useState} from "react";
import {Button, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";


const QueueItemTag = ({field, form: {touched, errors}, remove, ...props}) => {
    const [error, setError] = useState('')
    const [touch, setTouch] = useState(false)

    // Update touched
    useEffect(() => {
        // noinspection JSUnresolvedVariable
        if (touched.monumentTags && typeof touched.monumentTags[props.idx] !== 'undefined')
            setTouch(true)
    }, [touched])

    // Update errors
    useEffect(() => {
        // noinspection JSUnresolvedVariable
        if (errors.monumentTags && typeof errors.monumentTags[props.idx] !== 'undefined') {
            setError(errors.monumentTags[props.idx].tag.name)
        } else
            setError('')
    }, [errors])

    // noinspection JSValidateTypes,RequiredAttributes
    return (
        <>
            <InputGroup size="sm">
                <Form.Control {...field} type="text" value={field.value} isValid={touch && !error}
                              isInvalid={!!error}/>
                <InputGroup.Append>
                    <OverlayTrigger placement="bottom" overlay={(
                        <Tooltip id="coords-toggle">
                            Delete Tag
                        </Tooltip>)}>
                        <Button className="material-icons" variant="outline-danger"
                                onClick={() => remove(props.idx)}>delete</Button>
                    </OverlayTrigger>
                </InputGroup.Append>
                <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
            </InputGroup>
        </>
    )
}

export default QueueItemTag
