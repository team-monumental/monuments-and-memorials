import React from 'react'
import Tag from "../../../Tags/Tag/Tag";

const QueueItemTags = ({tags, handleChange}) => {
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
        </div>
    )
}

export default QueueItemTags
