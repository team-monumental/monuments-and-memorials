import React from 'react'
import Tag from "../../../Tags/Tag/Tag";

const QueueItemTags = ({tags, handleChange}) => {
    return (
        <div className="tags-grid">
            {tags.map(tag => (
                <Tag name={tag.tag.name}
                     selectable={true}
                     defaultIcon={'remove_circle_outline'}
                     selectedIcon={'undo'}
                     isMaterial={tag.tag.isMaterial}
                     onSelect={handleChange}/>
            ))}
        </div>
    )
}

export default QueueItemTags
