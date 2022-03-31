import React from 'react'
import {Col, Form} from "react-bootstrap";

const QueueItemField = ({field, form: {touched, errors}, ...props}) => {
    const getFormControl = () => {
        switch (props.type) {
            // case 'date':
            //     return (
            //         <Form.Control name={name} type={type} value={value.slice(0, 10)}/>
            //     )
            // case 'tags':
            //     return (
            //         <QueueItemTags tags={data['monumentTags']}/>
            //     )
            // case 'text':
            //     return (
            //         <Form.Control name={name} type={type} value={value}/>
            //     )
            default:
                return (
                    <>
                        <Form.Control {...field} {...props}
                                      value={props.type === 'date' ? field.value.slice(0, 10) : field.value}
                                      isInvalid={!!errors[field.name]}
                                      // isValid={touched[field.name] && !errors[field.name]}
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
