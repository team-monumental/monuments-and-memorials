import React from 'react'
import Tag from "../../../Tags/Tag/Tag";

const QueueItemTags = ({tags, toggle, handleChange}) => {
    return (
        <div className="tags-grid">
            {tags.map((tag, idx) => (
                <Tag key={`active-record-tag-${idx}`}
                     name={tag.tag.name}
                     selectable={true}
                     defaultIcon={'cancel'}
                     selectedIcon={'undo'}
                     isMaterial={tag.tag.isMaterial}
                     onSelect={handleChange}/>
            ))}
            <div id="add-tag" className="tag" onClick={toggle}>
                <i className="material-icons">add</i>
            </div>
        </div>
    )
}

export default QueueItemTags
