import React from 'react';
import './Tags.scss';
import Tag from './Tag/Tag';

/**
 * Renders a list of tags belonging to a Monument
 */
export default class Tags extends React.Component {

    render() {
        const { tags, selectable, onSelect, selectedIcon, searchUri } = this.props;
        if (!tags) return (<div/>);
        return (
            <div className="tags">
                {tags.sort((a, b) => (a && b && a.name > b.name) ? 1 : -1).map(tag => {
                    return (
                        tag && <Tag key={tag.id} name={tag.name} isMaterial={tag.isMaterial} selectable={selectable} onSelect={value => onSelect(value, tag)} selectedIcon={selectedIcon} selected={tag.selected} searchUri={searchUri}/>
                    );
                })}
            </div>
        );
    }
}