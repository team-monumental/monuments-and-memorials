import React, {useEffect, useState} from 'react';
import * as QueryString from 'query-string';

import './Tag.scss';

const Tag = ({name, selectable, selectedIcon, isMaterial, onSelect}) => {
    const [selected, setSelected] = useState(false)
    const params = {}
    const link = `/search/?${QueryString.stringify(params)}`;

    const toggleSelected = () => {
        setSelected(!selected)
        onSelect(!selected)
    }

    useEffect(() => {
        if (isMaterial) params.materials = name
        else params.tags = name
    }, [])

    return (
        selectable ? (
            <div className="tag text-truncate" onClick={toggleSelected}>
                {name}
                <i className="material-icons">
                    {selected ? selectedIcon || 'check' : 'add'}
                </i>
            </div>) : (
            <a href={link} className="tag text-truncate">{name}</a>)
    )
}

export default Tag