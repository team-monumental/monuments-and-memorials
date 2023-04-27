import React, {useEffect} from "react";
import {Button, Col, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";

const QueueItemLong = ({field, form: {touched, errors, values}, ...props}) => {
    // noinspection JSValidateTypes,RequiredAttributes
    return (
        <>
            <Form.Label>{props.text}</Form.Label>
            <InputGroup hasValidation>
                <InputGroup.Prepend>
                    <InputGroup.Text>Longitude</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control {...field} value={values.lon}
                    isInvalid={!!errors['lon']}
                    isValid={touched['lon'] && !errors['lon']}/>
            </InputGroup>
            <Form.Control.Feedback type="invalid">{errors['lon']}</Form.Control.Feedback>
        </>
    )
}

export default QueueItemLong
