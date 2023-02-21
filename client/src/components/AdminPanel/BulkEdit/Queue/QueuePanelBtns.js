import React from 'react'
import {Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";

const QueuePanelBtns = ({dq, save, reset, active}) => {
    const controls = [
        {
            text: 'Save',
            variant: 'primary',
            type: 'submit',
            click: save
        }, {
            text: 'Reset',
            variant: 'light',
            type: 'reset',
            click: reset
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
                <span><i><Link to={`/monuments/${active.id}`} style={{color: "#17a2b8", marginLeft: "50%", height: '100%', display: 'flex', alignItems: "center"}} target="_blank"
                className="material-icons">open_in_new</Link></i></span>
            </ButtonGroup>
        </div>
    )
}

export default QueuePanelBtns
