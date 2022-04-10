import React, {useEffect, useState} from 'react';
import * as QueryString from 'query-string';

import './Tag.scss';

const Tag = ({name, selectable, defaultIcon = 'add', selectedIcon = 'check', isMaterial, onSelect}) => {
    const [selected, setSelected] = useState(false)

    const params = {tags: name}
    const link = `/search/?${QueryString.stringify(params)}`;

    const toggleSelected = () => {
        setSelected(!selected)
        onSelect(!selected)
    }

    useEffect(() => {
        if (isMaterial) params.materials = name
        else params.tags = name
    }, [isMaterial, name, params.materials, params.tags])

    return (
        selectable ? (
            <div className="tag text-truncate" onClick={toggleSelected}>
                {name}
                <i className="material-icons">
                    {selected ? selectedIcon : defaultIcon}
                </i>
            </div>) : (
            <a href={link} className="tag text-truncate">{name}</a>)
    )
}

export default Tag