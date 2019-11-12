import React from 'react';
import './Tags.scss';
import Tag from './Tag/Tag';

/**
 * Renders a list of tags belonging to a Monument
 */
export default class Tags extends React.Component {

    render() {
        const { tags, selectable, onSelect, selectedIcon } = this.props;
        if (!tags) return (<div/>);
        return (
            <div className="tags">
                {tags.map(tag => {
                    return (
                        <Tag key={tag.id} name={tag.name} isMaterial={tag.isMaterial} selectable={selectable} onSelect={value => onSelect(value, tag)} selectedIcon={selectedIcon} selected={tag.selected}/>
                    );
                })}
            </div>
        );
    }
}