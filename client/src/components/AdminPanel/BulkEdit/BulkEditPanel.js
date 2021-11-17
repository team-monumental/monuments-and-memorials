import React from 'react'
import {Card, Col, Container, Row} from "react-bootstrap";
import BulkEditSearchPanel from "./Search/SearchPanel";

import './BulkEdit.scss'
import SearchPanelButtons from "./Search/SearchPanelButtons";

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
                        <SearchPanelButtons/>
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
