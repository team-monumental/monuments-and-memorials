import React from 'react';
import './TagColumn.scss';
import Tags from '../Tags/Tags';

/**
 * Presentational component for a column of Tags
 */
export default class TagColumn extends React.Component {

    render() {
        const { variant, tags } = this.props;

        return (
            <div className='tag-column-container'>
                <h2 className='font-weight-bold'>
                    {variant.charAt(0).toUpperCase() + variant.substring(1)}
                </h2>
                <Tags tags={tags} selectable={false}/>
            </div>
        );
    }
}