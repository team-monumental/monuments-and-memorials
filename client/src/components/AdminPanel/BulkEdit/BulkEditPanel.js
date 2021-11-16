import React from 'react'
import {Card, Col, Container, Row} from "react-bootstrap";
import BulkEditSearchPanel from "./BulkEditSearchPanel";

import './BulkEdit.scss'

const BulkEditPanel = (props) => {
    return (
        <div className="bulk-edit">
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title>
                                    Bulk Edit Monuments and Memorials
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <BulkEditSearchPanel/>
                            </Card.Body>
                        </Card>
                        {/* TODO: Search panel buttons here */}
                    </Col>
                    <Col>
                        {/* TODO: Queue panel component here */}
                        {/* TODO: Queue panel buttons here */}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default BulkEditPanel
