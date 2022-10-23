import React, {useEffect} from 'react'
import {Container} from "react-bootstrap";

const EditHistoryPanel = (props) => {

    const {editHistoryList} = props

    return (
        <Container className="queue-panel">
            <p>EditHistoryPanel</p>
            {editHistoryList.map(monument => {
                return (
                    <p>{monument.title}</p>
                )

            })}
        </Container>
    )
}

export default EditHistoryPanel
