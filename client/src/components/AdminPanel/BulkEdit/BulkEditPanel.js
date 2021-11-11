import React from 'react'
import {Card, Col, Container, Row} from "react-bootstrap";
import BulkEditSearchPanel from "./BulkEditSearchPanel";

const BulkEditPanel = (props) => {
    return (
        <div className="bulk-edit">
            <Card>
                <Card.Header>
                    <Card.Title>
                        Bulk Edit Monuments and Memorials
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col>
                                <BulkEditSearchPanel/>
                            </Col>
                            <Col>
                                {/* TODO: Queue panel component here */}
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </div>
    )
}

export default BulkEditPanel
