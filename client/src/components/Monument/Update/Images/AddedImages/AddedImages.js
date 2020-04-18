import * as React from 'react';
import './AddedImages.scss';
import Thumbnails from '../../../Images/Thumbnails/Thumbnails';

/**
 * Presentational component for displaying newly added images for a Monument
 */
export default class AddedImages extends React.Component {

    render() {
        let { images } = this.props;

        let addedImagesDisplay = <span className="font-weight-bold">NONE</span>;

        if (images) {
            const imagesWithNames = images.filter(image => image.name && image.name.length);
            const imagesWithUrls = images.filter(image => image.url && image.url.length);

            if (imagesWithNames.length) {
                let addedImagesList = [];

                for (const image of images) {
                    addedImagesList.push(<li className="added" key={image.name}>{image.name}</li>);
                }

                addedImagesDisplay = <ul>{addedImagesList}</ul>;
            }
            else if (imagesWithUrls.length) {
                addedImagesDisplay = <Thumbnails imageUrls={imagesWithUrls.map(image => image.url)}/>
            }
        }

        return (
            <div>
                <span className="font-weight-bold">Added Images:&nbsp;</span>
                {addedImagesDisplay}
            </div>
        );
    }
}