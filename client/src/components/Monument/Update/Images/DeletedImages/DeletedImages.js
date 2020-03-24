import * as React from 'react';
import './DeletedImages.scss';
import { getS3ImageNameFromObjectUrl } from '../../../../../utils/api-util';

/**
 * Presentational component for displaying deleted image URLs for a Monument
 */
export default class DeletedImages extends React.Component {

    render() {
        const { newMonument } = this.props;

        let deletedImagesDisplay = <span className="font-weight-bold">NONE</span>;

        if (newMonument.deletedImageUrls && newMonument.deletedImageUrls.length) {
            let deletedImagesList = [];

            for (const deletedImageUrl of newMonument.deletedImageUrls) {
                deletedImagesList.push(<li className="removed" key={deletedImageUrl}>{getS3ImageNameFromObjectUrl(deletedImageUrl)}</li>);
            }

            deletedImagesDisplay = <ul>{deletedImagesList}</ul>;
        }

        return (
            <div>
                <span className="font-weight-bold">Deleted Images:&nbsp;</span>
                {deletedImagesDisplay}
            </div>
        );
    }
}