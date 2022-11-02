import React, { useEffect } from 'react'
import { Card, Container, Row, Col } from "react-bootstrap";

const EditHistoryPanel = (props) => {

    const { editHistoryList } = props

    return (
        <Container style={{ 'padding-left': '0%', 'padding-right': '0%', 'padding-top': '15px'  }}>
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
                                {monument.changedFields.map(field => {
                                    return (
                                        <Col>{field}</Col>
                                    )
                                })}
                            </Row>
                        )
                    })}
                </Card.Body>
            </Card>
        </Container>
    )
}

export default EditHistoryPanel
