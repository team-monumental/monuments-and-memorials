import React, {useRef, useState} from "react";
import {Overlay, OverlayTrigger, Popover} from "react-bootstrap";

const ExpandableTag = ({counter, tags}) => {
    const [show, setShow] = useState(false)
    const target = useRef(null)

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">More Tags</Popover.Header>
            <Popover.Body>
                {tags}
            </Popover.Body>
        </Popover>
    )

    return (
        <>
            <OverlayTrigger>
                <div className="tag text-truncate" ref={target} onClick={() => setShow(!show)}>
                    +{counter}
                </div>
            </OverlayTrigger>
            {/*<div className="tag text-truncate" ref={target} onClick={() => setShow(!show)}>*/}
            {/*    +{counter}*/}
            {/*</div>*/}
            {/*<Overlay target={target.current} show={show} placement="right">*/}
            {/*    {({ placement, arrowProps, show: _show, popper, ...props }) => (*/}
            {/*        <div*/}
            {/*            {...props}*/}
            {/*            style={{*/}
            {/*                backgroundColor: 'rgba(255, 100, 100, 0.85)',*/}
            {/*                padding: '2px 10px',*/}
            {/*                color: 'white',*/}
            {/*                borderRadius: 3,*/}
            {/*                ...props.style,*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            Simple tooltip*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</Overlay>*/}
        </>
    )
}

export default ExpandableTag
