import * as React from 'react';
import './DeletedImages.scss';
import {getS3ImageNameFromObjectUrl} from '../../../../../utils/api-util';
import Thumbnails from '../../../Images/Thumbnails/Thumbnails';

/**
 * Presentational component for displaying deleted images for a Monument
 */
export default class DeletedImages extends React.Component {

    render() {
        const {deletedImageUrls, displayImageNames} = this.props;

        let deletedImagesDisplay = <span className="font-weight-bold">NONE</span>;

        if (deletedImageUrls && deletedImageUrls.length) {
            let deletedImagesList = [];

            if (displayImageNames) {
                for (const deletedImageUrl of deletedImageUrls) {
                    deletedImagesList.push(<li className="removed"
                                               key={deletedImageUrl}>{getS3ImageNameFromObjectUrl(deletedImageUrl)}</li>);
                }

                deletedImagesDisplay = <ul>{deletedImagesList}</ul>;
            } else {
                deletedImagesDisplay = <Thumbnails imageUrls={deletedImageUrls}/>
            }
        }

        return (
            <div>
                <span className="font-weight-bold">Deleted Images:&nbsp;</span>
                {deletedImagesDisplay}
            </div>
        );
    }
}