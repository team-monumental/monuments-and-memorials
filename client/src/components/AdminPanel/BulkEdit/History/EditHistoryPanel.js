import React, { useEffect } from 'react'
import { Card, Container, Row, Col } from "react-bootstrap";

const EditHistoryPanel = (props) => {

    const { editHistoryList } = props

    return (
        <Container>
            <Card>
                <Card.Header>
                    <Card.Title>
                        Edit History
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {editHistoryList.map(monument => {
                        return (
                            <Row>
                                <Col lg={3}><span>{monument.title}</span></Col>
                            </Row>
                        )
                    })}
                </Card.Body>
            </Card>
        </Container>
    )
}

export default EditHistoryPanel
