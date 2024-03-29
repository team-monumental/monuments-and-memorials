import React, {useEffect, useState} from 'react'
import {Pagination} from "react-bootstrap";

const SearchResultNav = ({results, setItems, setActive, active, setStep, step}) => {

    const handleActive = (idx) => {
        setActive(idx)
    }

    useEffect(() => {
        setItems(results.slice(active * step, step + (active * step)))
    }, [active, step, results, setItems])

    useEffect(() => {
        setItems(results.slice(active * step, step + (active * step)))
    }, [active, step, results, setItems])

    return (
        <Pagination>
            <Pagination.First disabled={active === 0} onClick={() => handleActive(0)}/>
            <Pagination.Prev disabled={active === 0} onClick={() => handleActive(active - 1)}/>
            {Array.from({length: Math.ceil(results.length / step)}, (x, i) => i).map(idx =>
                <Pagination.Item key={`page-item-${idx}`} active={active === idx} onClick={() => setActive(idx)}>
                    {idx + 1}
                </Pagination.Item>
            )}
            <Pagination.Next disabled={active >= (results.length / step) - 1}
                             onClick={() => handleActive(active + 1)}/>
            <Pagination.Last disabled={active >= (results.length / step) - 1}
                             onClick={() => handleActive(Math.ceil(results.length / step) - 1)}/>
        </Pagination>
    )
}

export default SearchResultNav
