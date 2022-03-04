import React, {useRef, useState} from "react";
import {Button, OverlayTrigger, Popover} from "react-bootstrap";

const ExpandableTag = ({counter, tags}) => {
    const [show, setShow] = useState(false)
    const target = useRef(null)

    const popover = (props) => (
        <Popover id="popover-basic" {...props}>
            <Popover.Title as="h3">More Tags</Popover.Title>
            <Popover.Content>
                {tags}
            </Popover.Content>
        </Popover>
    )

    return (
        <>
            <OverlayTrigger trigger="click" key="right" placement="right" overlay={popover}>
                <div className="tag text-truncate" ref={target} onClick={() => setShow(!show)}>
                    +{counter}
                </div>
            </OverlayTrigger>
        </>
    )
}

export default ExpandableTag
