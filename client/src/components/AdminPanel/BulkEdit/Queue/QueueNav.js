import React from 'react'
import {Pagination} from "react-bootstrap";

const QueueNav = ({current, total}) => {
    return (
        <Pagination>
            <Pagination.First/>
            <Pagination.Prev/>
            <Pagination.Item>
                {`${current + 1} of ${total}`}
            </Pagination.Item>
            <Pagination.Next/>
            <Pagination.Last/>
        </Pagination>
    )
}

export default QueueNav
