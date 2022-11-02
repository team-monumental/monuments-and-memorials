import React, {useEffect, useState} from 'react'
import moment from "moment";
import {Col, Container, InputGroup, ListGroup, Row} from "react-bootstrap";

import SearchResultBtns from "./SearchResultBtns";
import Tag from "../../../Tags/Tag/Tag";
import ExpandableTag from "../../../Tags/Tag/ExpandableTag";

import './Search.scss'

// TODO: Apply CSS classes to format
const SearchResult = ({data, nq, dq, selected}) => {
    const [checked, setChecked] = useState(false)

    const toggleChecked = () => {
        setChecked(!checked)
        checked ? nq(data) : dq(data.id)
    }

    // Enqueues/dequeues result when checkbox is toggled
    useEffect(() => {
        checked ? nq(data) : dq(data.id)
    }, [checked, selected])

    // Enqueues/dequeues result when "select all" checkbox is toggled
    useEffect(() => {
        setChecked(selected)
    }, [selected])

    // Un-checks checkbox when a monument is deleted
    useEffect(() => {
        setChecked(false)
    }, [data])

    // noinspection JSUnresolvedVariable
    return (
        <ListGroup.Item as="li">
            <Container fluid>
                <Row>
                    <Col lg={1}><InputGroup.Checkbox checked={checked} onChange={toggleChecked}/></Col>
                    <Col lg={3}><span>{data.title}</span></Col>
                    <Col lg={2}><span>{data.artist}</span></Col>
                    <Col lg={2}>
                        <div className="tags-list">
                            <Tag name={data.monumentTags[0].tag.name}
                                 selectable={false}
                                 selectedIcon={null}
                                 isMaterial={false}/>
                            <ExpandableTag counter={data.monumentTags.length - 1} tags={data.monumentTags.slice(1)}/>
                        </div>
                    </Col>
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
