import React, {useRef, useState} from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";

const ExpandableTag = ({counter, tags}) => {
    const [show, setShow] = useState(false)
    const target = useRef(null)

    const popover = (props) => (
        <Popover id="popover-basic" {...props}>
            <Popover.Title as="h3">Other Tags</Popover.Title>
            <Popover.Content>
                {tags.map(tag => <p>
                    <a href={`/search/?${tag.tag.isMaterial ? 'materials' : 'tags'}=${tag.tag.name}`}>
                        {tag.tag.name}
                    </a>
                </p>)}
            </Popover.Content>
        </Popover>
    )

    return (
        <>
            <OverlayTrigger trigger="click" key="right" placement="right" overlay={popover}>
                <div className="tag text-truncate expandable" ref={target} onClick={() => setShow(!show)}>
                    +{counter}
                </div>
            </OverlayTrigger>
        </>
    )
}

export default ExpandableTag
