import React from 'react'
import {Col, Container, InputGroup, ListGroup, Row} from "react-bootstrap";
import Tag from "../../../Tags/Tag/Tag";
import './Search.scss'

// TODO: Apply CSS classes to format
const BulkEditSearchResult = ({title, artist, date, tags}) => {
    return (
        <ListGroup.Item as="li">
            <Container fluid>
                <Row>
                    <Col lg={1}><InputGroup.Checkbox/></Col>
                    <Col lg={3}><span>{title}</span></Col>
                    <Col lg={2}><span>{artist}</span></Col>
                    <Col lg={3}>
                        <div className="tags-list">
                            {tags.map(tag => (
                                <Tag name={tag} selectable={false} selectedIcon={null} isMaterial={false}/>
                            ))}
                        </div>
                    </Col>
                    <Col lg={2}><span>{date}</span></Col>
                    <Col lg={true}>
                        <span className="result-opts-btn"><i className="material-icons">more_horiz</i></span>
                    </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    )
}

export default BulkEditSearchResult
