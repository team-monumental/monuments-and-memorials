import React, {useEffect, useLayoutEffect, useState} from "react";
import {Carousel, Image} from "react-bootstrap";


const QueueItemGallery = ({form: {values}}) => {
    const [images, setImages] = useState(null)
    const [active, setActive] = useState(0)

    // useLayoutEffect(() => {
    //     setImages(values.map())
    // }, [])

    useEffect(() => {
        console.info(values)
    })

    return (
        <Carousel>

        </Carousel>
    )
}

export default QueueItemGallery
