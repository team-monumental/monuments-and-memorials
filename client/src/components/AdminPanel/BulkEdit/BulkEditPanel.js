import React from 'react'
import {Card, CardGroup, Col, Container, Row} from "react-bootstrap";
import BulkEditSearchPanel from "./BulkEditSearchPanel";

import './BulkEdit.scss'
import BulkEditUpdateForm from "./Queue/BulkEditUpdateForm";

const BulkEditPanel = (props) => {
    return (
        <div className="bulk-edit">
            <Container>
                <Row>
                    <Col lg={6}>
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
                    <Col lg={6}>
                        <Card>
                            <Card.Header>
                                <Card.Title>
                                    Editing Queue
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                {/* TODO: Will need to create a new component with less bloat */}
                                <BulkEditUpdateForm/>
                            </Card.Body>
                        </Card>
                        {/* TODO: Queue panel buttons here */}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default BulkEditPanel
