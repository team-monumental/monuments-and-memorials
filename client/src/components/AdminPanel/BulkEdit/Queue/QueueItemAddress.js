import React, {useEffect} from "react";
import {Button, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";


// TODO: Add props from parent
const QueueItemAddress = ({field, form: {touched, errors, values}, ...props}) => {
    // noinspection JSValidateTypes,RequiredAttributes
    return (
        <Form.Group>
            <Form.Label>{props.text}</Form.Label>
            <InputGroup hasValidation>
                <Form.Control {...field} value={field.value || undefined}/>
                <InputGroup.Append>
                    <OverlayTrigger placement="bottom" overlay={(
                        <Tooltip id="coords-toggle">
                            Swap to Coordinates
                        </Tooltip>)}>
                        <Button className="material-icons" onClick={props.toggle}>swap_vert</Button>
                    </OverlayTrigger>
                </InputGroup.Append>
            </InputGroup>
            {/* TODO: Convert address to coordinates */}
            <Form.Text className="text-muted">
                Coordinates: {values.coordinates? values.coordinates.coordinates[1] : 'N/A'}, {values.coordinates? values.coordinates.coordinates[0] : 'N/A'}
            </Form.Text>
        </Form.Group>
    )
}

export default QueueItemAddress
