import React from "react";
import {Button, Form, InputGroup} from "react-bootstrap";


// TODO: Add props from parent
const QueueItemAddress = ({field, ...props}) => {
    return (
        <Form.Group>
            <Form.Label>{props.text}</Form.Label>
            <InputGroup hasValidation>
                <Form.Control defaultValue={field.value}/>
                <InputGroup.Append>
                    <Button className="material-icons" onClick={props.toggle}>swap_vert</Button>
                </InputGroup.Append>
            </InputGroup>
            <Form.Label>Coordinates Placeholder</Form.Label>
        </Form.Group>
    )
}

export default QueueItemAddress
