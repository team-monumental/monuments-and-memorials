import React from 'react'
import {Card, Col, Container, Row} from "react-bootstrap";
import BulkEditSearchPanel from "./BulkEditSearchPanel";

import './BulkEdit.scss'

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
                    <BulkEditSearchPanel/>
                </Card.Body>
            </Card>
        </div>
    )
}

export default BulkEditPanel
