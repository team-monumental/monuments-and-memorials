import React, { useEffect } from 'react'
import { Card, Container, Row, Col } from "react-bootstrap";

const EditHistoryPanel = (props) => {

    const { editHistoryList } = props

    return (
        <Container>
            <Card style={{ width: '100%' }}>
                <Card.Header>
                    <Card.Title>
                        Edit History
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {editHistoryList.map(monument => {
                        return (
                            <Row style={{ padding: '15px' }}>
                                {monument.title}
                            </Row>
                        )
                    })}
                </Card.Body>
            </Card>
        </Container>
    )
}

export default EditHistoryPanel
