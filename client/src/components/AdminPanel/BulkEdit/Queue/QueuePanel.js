import React, {useEffect} from 'react'
import QueueItem from "./QueueItem";
import QueueNav from "./QueueNav";
import {Container} from "react-bootstrap";

const QueuePanel = ({queue, active, setActive}) => {

    const handleFirst = () => {
        setActive(queue[0])
    }

    const handleNext = () => {
        setActive(queue[queue.indexOf(active) + 1])
    }

    const handlePrev = () => {
        setActive(queue[queue.indexOf(active) - 1])
    }

    const handleLast = () => {
        setActive(queue[queue.length - 1])
    }

    // Update "active" record to the most recently selected result
    useEffect(() => {
        if (queue.length > 0) setActive(queue[queue.length - 1])
    }, [queue, setActive])

    // Set the "active" record to "null" when there is no selected results
    useEffect(() => {
        if (queue.length === 0) setActive(null)
    }, [queue, setActive])

    return (
        <Container className="queue-panel">
            {active === null ? (
                <div className="empty">
                    <h5>Nothing here...</h5>
                </div>
            ) : (
                <QueueItem data={active}/>
            )}
            {active !== null && (
                <QueueNav current={queue.indexOf(active)}
                          total={queue.length}
                          first={handleFirst}
                          next={handleNext}
                          prev={handlePrev}
                          last={handleLast}/>
            )}
        </Container>
    )
}

export default QueuePanel
