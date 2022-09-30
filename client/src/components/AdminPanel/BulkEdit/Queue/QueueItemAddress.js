import React from "react";
import {Button, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";


// TODO: Add props from parent
const QueueItemAddress = ({field, ...props}) => {
    // noinspection JSValidateTypes,RequiredAttributes
    return (
        <Form.Group>
            <Form.Label>{props.text}</Form.Label>
            <InputGroup hasValidation>
                <Form.Control defaultValue={field.value}/>
                <InputGroup.Append>
                    <OverlayTrigger placement="bottom" overlay={(
                        <Tooltip id="coords-toggle">
                            Swap to Coordinates
                        </Tooltip>)}>
                        <Button className="material-icons" onClick={props.toggle}>swap_vert</Button>
                    </OverlayTrigger>
                </InputGroup.Append>
            </InputGroup>
            <Form.Label>Coordinates Placeholder</Form.Label>
        </Form.Group>
    )
}

export default QueueItemAddress
