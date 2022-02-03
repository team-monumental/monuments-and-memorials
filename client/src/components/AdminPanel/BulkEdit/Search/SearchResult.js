import React, {useEffect, useState} from 'react'
import moment from "moment";
import {Col, Container, InputGroup, ListGroup, Row} from "react-bootstrap";

import SearchResultBtns from "./SearchResultBtns";
import Tag from "../../../Tags/Tag/Tag";

import './Search.scss'

// TODO: Apply CSS classes to format
const SearchResult = ({data, title, artist, date, tags, nq, dq}) => {
    const [checked, setChecked] = useState(false)

    const toggleChecked = () => {
        setChecked(!checked)

        checked ? nq(data) : dq(data.id)
    }

    useEffect(() => {
        checked ? nq(data) : dq(data.id)
    }, [checked])

    return (
        <ListGroup.Item as="li">
            <Container fluid>
                <Row>
                    <Col lg={1}><InputGroup.Checkbox checked={checked} onChange={toggleChecked}/></Col>
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
                    <Col lg={2}>
                        <SearchResultBtns monumentId={id}/>
                    </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    )
}

export default SearchResult
