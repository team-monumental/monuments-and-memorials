import React from 'react'
import {Container} from "react-bootstrap";
import QueueItem from "./QueueItem";

const QueuePanel = (props) => {
    return (
        <Container className="queue-panel">
            <QueueItem/>
        </Container>
    )
}

export default QueuePanel
