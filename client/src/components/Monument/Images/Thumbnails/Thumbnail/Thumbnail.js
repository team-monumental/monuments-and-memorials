import * as React from 'react';
import './Thumbnail.scss';
import {getS3ImageNameFromObjectUrl} from '../../../../../utils/api-util';

/**
 * Presentational component for displaying a thumbnail image for a Monument
 */
export default class Thumbnail extends React.Component {

    render() {
        const {imageUrl} = this.props;
        const imageFileName = imageUrl ? getS3ImageNameFromObjectUrl(imageUrl) : 'None';
        const imageName = imageFileName ? imageFileName.split('.')[0] : 'None';

        return (
            <div style={{backgroundImage: `url("${imageUrl}")`}} className="monument-thumbnail" role="img"
                 aria-label={`Image: ${imageName}`}/>
        );
    }
}