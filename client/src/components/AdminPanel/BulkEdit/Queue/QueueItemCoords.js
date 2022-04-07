import React from "react";
import {Button, Form, InputGroup} from "react-bootstrap";


const QueueItemCoords = ({field, form: {touched, errors}, ...props}) => {
    return (
        <Form.Group>
            <Form.Label>{props.text}</Form.Label>
            <InputGroup hasValidation>
                <InputGroup.Prepend>
                    <InputGroup.Text>Latitude</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control required/>
                <InputGroup.Prepend>
                    <InputGroup.Text>Longitude</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control required/>
                <InputGroup.Append>
                    <Button className="material-icons" onClick={props.toggle}>swap_vert</Button>
                </InputGroup.Append>
            </InputGroup>
            <Form.Label>Address Placeholder</Form.Label>
        </Form.Group>
    )
}

export default QueueItemCoords
