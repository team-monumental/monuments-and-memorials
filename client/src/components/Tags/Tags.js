import React from 'react';
import './Tags.scss';

export default class Tags extends React.Component {

    render() {
        if (!this.props.tags) return (<div/>);
        return (
            <div className="tags">
                {this.props.tags.sort((a, b) => a.name.length - b.name.length).map(tag => {
                    return (
                        <div key={tag.name} className="tag text-truncate">{tag.name}</div>
                    )
                })}
            </div>
        );
    }
}