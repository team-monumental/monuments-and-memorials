import * as React from 'react';
import './Thumbnail.scss';

/**
 * Presentational component for displaying a thumbnail image for a Monument
 */
export default class Thumbnail extends React.Component {

    render() {
        const { imageUrl } = this.props;

        return (
            <div style={{backgroundImage: `url("${imageUrl}")`}} className="monument-thumbnail"/>
        );
    }
}