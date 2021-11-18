import React from 'react'
import moment from "moment";
import {Col, Container, InputGroup, ListGroup, Row} from "react-bootstrap";

import SearchResultBtns from "./SearchResultBtns";
import Tag from "../../../Tags/Tag/Tag";

import './Search.scss'

// TODO: Apply CSS classes to format
const SearchResult = ({title, artist, date, tags}) => {
    return (
        <ListGroup.Item as="li">
            <Container fluid>
                <Row>
                    <Col lg={1}><InputGroup.Checkbox/></Col>
                    <Col lg={3}><span>{title}</span></Col>
                    <Col lg={2}><span>{artist}</span></Col>
                    <Col lg={2}>
                        <div className="tags-list">
                            {tags.map(tag => (
                                <Tag name={tag} selectable={false} selectedIcon={null} isMaterial={false}/>
                            ))}
                        </div>
                    </Col>
                    <Col lg={2}><span>{moment(date, "YYYY-MM-DD").format("DD MMM YYYY")}</span></Col>
                    <Col lg={2} >
                        <SearchResultBtns/>
                    </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    )
}

export default SearchResult
