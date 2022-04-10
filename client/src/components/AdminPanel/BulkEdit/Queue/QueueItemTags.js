import React, {useState} from 'react'
import {Button, Form} from "react-bootstrap";
import {Field} from "formik";
import QueueItemTag from "./QueueItemTag";
import validator from "validator/es";

const QueueItemTags = ({field, form: {values}, remove, push, ...props}) => {
    const [newTagId, setNewTagId] = useState(-1)

    const handlePush = () => {
        push({
            id: newTagId,
            createdDate: new Date(),
            lastModifiedDate: null,
            createdBy: null,
            tag: {
                id: newTagId,
                createdDate: new Date(),
                lastModifiedDate: null,
                createdBy: null,
                name: '',
                isMaterial: false
            }
        })

        setNewTagId(newTagId - 1)
    }

    const validateTag = (value) => {
        return validator.isEmpty(value) ? 'Required' : ''
    }

    // noinspection JSUnresolvedVariable
    return (
        <Form.Group>
            <Form.Label>Tags</Form.Label>
            <div className="tags-grid">
                {values.monumentTags.map((tag, idx) => (
                    // TODO: Add validation, component
                    <Field {...{idx, remove}} key={`tag-${idx}`}
                           name={`monumentTags.${idx}.tag.name`}
                           validate={validateTag}
                           component={QueueItemTag}/>
                ))}

                <Button size="sm" variant="outline-primary" className="material-icons"
                        onClick={handlePush}>add</Button>
            </div>
        </Form.Group>
    )
}

export default QueueItemTags
