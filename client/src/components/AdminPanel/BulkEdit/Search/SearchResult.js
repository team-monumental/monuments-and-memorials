import React, {useEffect, useState} from 'react'
import moment from "moment";
import {Col, Container, InputGroup, ListGroup, Row} from "react-bootstrap";

import SearchResultBtns from "./SearchResultBtns";
import Tag from "../../../Tags/Tag/Tag";

import './Search.scss'

// TODO: Apply CSS classes to format
const SearchResult = ({data, nq, dq}) => {
    const [checked, setChecked] = useState(false)

    const toggleChecked = () => {
        setChecked(!checked)
        checked ? nq(data) : dq(data.id)
    }

    useEffect(() => {
        checked ? nq(data) : dq(data.id)
    }, [checked])

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
                            {data.monumentTags.slice(0, 2).map(monumentTag => monumentTag.tag.name).map(tag => (
                                <Tag name={tag} selectable={false} selectedIcon={null} isMaterial={false}/>
                            ))}
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
