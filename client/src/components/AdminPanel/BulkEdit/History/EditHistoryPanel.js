import React, { useEffect } from 'react'
import { Card, Container, Row, Col } from "react-bootstrap";

const EditHistoryPanel = (props) => {

    const { editHistoryList } = props

    return (
        <Container style={{ paddingLeft: '0%', PaddingRight: '0%', PaddingTop: '15px'}}>
            <Card>
                <Card.Header>
                    <Card.Title>
                        Edit History
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Row style={{ padding: '15px', borderBottom: "3px solid rgb(212, 212, 212)"}}>
                        <Col>ID</Col>
                        <Col>TITLE</Col>
                        <Col>CHANGED FIELDS</Col>
                    </Row>
                    {editHistoryList.map(monument => {
                        return (
                            <Row style={{ padding: '15px', borderBottom: "3px solid rgb(212, 212, 212)"}}>
                                <Col>{monument.id}</Col>
                                <Col>{monument.title}</Col>
                                <Col>{monument.changedFields.join(", ")}</Col>
                            </Row>
                        )
                    })}
                </Card.Body>
            </Card>
        </Container>
    )
}

export default EditHistoryPanel
