import React, {useEffect} from "react";
import {Button, Col, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";


const QueueItemLat = ({field, form: {touched, errors, values}, ...props}) => {

    return (
        <>
            <Form.Label>{props.text}</Form.Label>
            <InputGroup hasValidation>
                <InputGroup.Prepend>
                    <InputGroup.Text>Latitude</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control {...field} value={values.lat}  
                    isInvalid={!!errors['lat']}
                    isValid={touched['lat'] && !errors['lat']}/>
            </InputGroup>
            <Form.Control.Feedback type="invalid">{errors['lat']}</Form.Control.Feedback>
        </>
    )
}

export default QueueItemLat
