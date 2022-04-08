import React, {useEffect} from "react";
import {Button, Form, InputGroup} from "react-bootstrap";

const QueueItemRef = ({field, form: {touched, errors}, ...props}) => {
    useEffect(() => {
        console.info(field)
    })

    return (
        <InputGroup>
            <Form.Control type="text" value={field.value}/>
            <InputGroup.Append>
                <Button className="material-icons" variant="outline-danger" onClick={() => props.remove(props.idx)}>
                    delete
                </Button>
            </InputGroup.Append>
        </InputGroup>
    )
}

export default QueueItemRef
