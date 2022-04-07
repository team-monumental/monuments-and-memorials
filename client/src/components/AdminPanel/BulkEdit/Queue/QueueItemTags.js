import React, {useEffect, useState} from 'react'
import Tag from "../../../Tags/Tag/Tag";
import {Button, Form, InputGroup} from "react-bootstrap";

const QueueItemTags = ({field, form: {touched, errors}, ...props}) => {
    const [showTagField, setShowTagField] = useState(false)

    const toggleTagField = () => {
        setShowTagField(!showTagField)
    }

    // TODO: Integrate within component
    const tagInput = (
        <InputGroup>
            <InputGroup.Prepend>
                <Button onClick={toggleTagField}><i className="material-icons">arrow_back</i></Button>
            </InputGroup.Prepend>
            {/* TODO: Override `onChange` handler, set values with `setValues` from Formik bag */}
            <Form.Control {...field} {...props}
                          value={field.value ? field.value.join(', ') : ''}
                          isInvalid={!!errors[field.name]}
            />
            <Form.Control.Feedback type="invalid">{errors[field.name]}</Form.Control.Feedback>
        </InputGroup>
    )

    // TODO: Integrate Formik FieldArray
    return (
        <Form.Group>
            <Form.Label>{props.text}</Form.Label>
            <div className="tags-grid">
                {field.value && field.value.map((tag, idx) => (
                    <Tag key={`active-record-tag-${idx}`}
                         name={tag.tag.name}
                         selectable={true}
                         defaultIcon={'cancel'}
                         selectedIcon={'undo'}
                         isMaterial={tag.tag.isMaterial}
                        // onSelect={handleChange}
                    />
                ))}
                {/* TODO: Add onClick func */}
                <div id="add-tag" className="tag">
                    <i className="material-icons">add</i>
                </div>
            </div>
        </Form.Group>
    )
}

export default QueueItemTags
