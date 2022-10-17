import React from 'react'
import {Button, ButtonGroup} from "react-bootstrap";

const QueuePanelBtns = ({dq, save}) => {
    const controls = [
        {
            text: 'Save',
            variant: 'primary',
            type: 'submit',
            click: save
        }, {
            text: 'Reset',
            variant: 'light'
        }, {
            text: 'Dequeue',
            variant: 'danger',
            click: dq
        }
    ]

    return (
        <div>
            <ButtonGroup className="panel-btns">
                {controls.map(control => (
                    <Button
                        key={`queue-panel-${control.text.toLowerCase()}-btn`}
                        variant={control.variant}
                        onClick={control.click}
                        type={control.type}
                    >
                        {control.text}
                    </Button>
                ))}
            </ButtonGroup>
        </div>
    )
}

export default QueuePanelBtns
