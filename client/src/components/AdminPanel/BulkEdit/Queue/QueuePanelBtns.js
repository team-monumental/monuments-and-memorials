import React from 'react'
import {Button, ButtonGroup} from "react-bootstrap";

const controls = [
    {
        text: 'Save',
        variant: 'primary'
    }, {
        text: 'Clear',
        variant: 'light'
    }, {
        text: 'Dequeue',
        variant: 'danger'
    }
]

const QueuePanelBtns = () => {
    return (
        <div>
            <ButtonGroup className="panel-btns">
                {controls.map(control => (
                    <Button key={`queue-panel-${control.text.toLowerCase()}-btn`} variant={control.variant}>
                        {control.text}
                    </Button>
                ))}
            </ButtonGroup>
        </div>
    )
}

export default QueuePanelBtns
