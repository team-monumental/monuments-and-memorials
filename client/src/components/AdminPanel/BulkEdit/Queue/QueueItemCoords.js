import React, {useEffect} from "react";
import {Button, Col, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";


const QueueItemCoords = ({field, form: {touched, errors, values}, ...props}) => {
    // noinspection JSValidateTypes,RequiredAttributes
    return (
        <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>{props.text}</Form.Label>
                <InputGroup hasValidation>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Latitude</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control required defaultValue={field.value.coordinates[1]}/>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Longitude</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control required defaultValue={field.value.coordinates[0]}/>
                    <InputGroup.Append>
                        <OverlayTrigger placement="bottom" overlay={(
                            <Tooltip id="coords-toggle">
                                Swap to Address
                            </Tooltip>
                        )}>
                            <Button className="material-icons" onClick={props.toggle}>swap_vert</Button>
                        </OverlayTrigger>
                    </InputGroup.Append>
                </InputGroup>
                {/* TODO: Convert coordinates to address */}
                <Form.Text className="text-muted">Address: {values.address}</Form.Text>
            </Form.Group>
        </Form.Row>
    )
}

export default QueueItemCoords
