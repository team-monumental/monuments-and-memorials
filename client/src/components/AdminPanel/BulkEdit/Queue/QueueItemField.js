import React, {useState} from 'react'
import {Button, Col, Form, InputGroup} from "react-bootstrap";
import QueueItemTags from "./QueueItemTags";

const QueueItemField = ({field, form: {touched, errors}, ...props}) => {
    const [showTagField, setShowTagField] = useState(false)

    const toggleTagField = () => {
        setShowTagField(!showTagField)
    }

    const getFormControl = () => {
        switch (props.type) {
            case 'date':
                return (
                    <>
                        <Form.Control {...field} {...props}
                                      value={field.value.slice(0, 10)}
                                      isInvalid={!!errors[field.name]}
                                      isValid={touched[field.name] && !errors[field.name]}
                        />
                        <Form.Control.Feedback type="invalid">{errors[field.name]}</Form.Control.Feedback>
                    </>
                )
            case 'tags':
                return showTagField ? (
                    <>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <Button onClick={toggleTagField}><i className="material-icons">arrow_back</i></Button>
                            </InputGroup.Prepend>
                            <Form.Control {...field} {...props}
                                          isInvalid={!!errors[field.name]}
                            />
                            <Form.Control.Feedback type="invalid">{errors[field.name]}</Form.Control.Feedback>
                        </InputGroup>
                    </>
                ) : (
                    <QueueItemTags tags={field.value} toggle={toggleTagField}/>
                )
            default:
                return (
                    <>
                        <Form.Control {...field} {...props}
                                      value={field.value}
                                      isInvalid={!!errors[field.name]}
                                      isValid={touched[field.name] && !errors[field.name]}
                        />
                        <Form.Control.Feedback type="invalid">{errors[field.name]}</Form.Control.Feedback>
                    </>
                )
        }
    }

    return (
        <Form.Row>
            <Form.Group as={Col} controlId={`${field.name}Validation`}>
                <Form.Label>{props.text}</Form.Label>
                {getFormControl()}
            </Form.Group>
        </Form.Row>
    )
}

export default QueueItemField
