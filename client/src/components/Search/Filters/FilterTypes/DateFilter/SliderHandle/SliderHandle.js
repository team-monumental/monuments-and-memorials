import React from "react";
import {Handle} from "rc-slider";
import './SliderHandle.scss'

export default function SliderHandle(props) {
    const {value, dragging, index, className, ...rest} = props;
    const handleStyle = {
        border: '3px solid #abe2fb',
        marginTop: '-10px',
        backgroundColor: 'black',
        width: '22px',
        height: '22px',
        marginLeft: '-2px'
    }
    return (
        <Handle className={className + ' date-slider-handle'} style={handleStyle} key={index} value={value} {...rest}>
            {dragging && <div className="handle-label">{value}</div>}
        </Handle>
    );
}
