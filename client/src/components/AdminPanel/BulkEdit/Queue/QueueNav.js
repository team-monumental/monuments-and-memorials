import React from 'react'
import {Pagination} from "react-bootstrap";

const QueueNav = ({current, total, first, next, prev, last}) => {
    return (
        <Pagination>
            <Pagination.First disabled={current === 0} onClick={first}/>
            <Pagination.Prev disabled={current === 0} onClick={prev}/>
            <Pagination.Item disabled>
                {`${current + 1} of ${total}`}
            </Pagination.Item>
            <Pagination.Next disabled={current === total - 1} onClick={next}/>
            <Pagination.Last disabled={current === total -1} onClick={last}/>
        </Pagination>
    )
}

export default QueueNav
