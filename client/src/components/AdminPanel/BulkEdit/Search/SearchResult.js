import React, {useEffect, useState} from 'react'
import moment from "moment";
import {Col, Container, InputGroup, ListGroup, Row} from "react-bootstrap";

import SearchResultBtns from "./SearchResultBtns";
import Tag from "../../../Tags/Tag/Tag";
import ExpandableTag from "../../../Tags/Tag/ExpandableTag";

import './Search.scss'

// TODO: Apply CSS classes to format
const SearchResult = ({data, nq, dq, selected, inQueue}) => {
    const [checked, setChecked] = useState(inQueue)

    const toggleChecked = () => {
        setChecked(!checked)
        checked ? dq(data.id) : nq(data)
    }

    // Enqueues/dequeues result when "select all" checkbox is toggled
    useEffect(() => {
        setChecked(selected)
    }, [selected])


    // Un-checks checkbox when a monument is deleted
    useEffect(() => {
        setChecked(inQueue)
    }, [inQueue])

    // noinspection JSUnresolvedVariable
    return (
        <ListGroup.Item as="li">
            <Container fluid>
                <Row checked={checked} onClick={toggleChecked}>
                    <Col lg={1}><InputGroup.Checkbox checked={checked} onChange={toggleChecked}/></Col>
                    <Col lg={1}><span>{data.id}</span></Col>
                    <Col lg={3}><span>{data.title}</span></Col>
                    <Col lg={2}><span>{data.artist}</span></Col>
                    <Col lg={2}><span>{data.state ? data.state : 'Not Provided'}</span></Col>
                    <Col lg={2}><span>{moment(data.date, "YYYY-MM-DD").format("DD MMM YYYY")}</span></Col>
                    <Col lg={2}>
                        <SearchResultBtns monumentId={data.id}/>
                    </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    )
}

export default SearchResult
