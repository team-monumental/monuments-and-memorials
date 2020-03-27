import * as React from 'react';
import './AddedImages.scss';

/**
 * Presentational component for displaying newly added image URLs for a Monument
 */
export default class AddedImages extends React.Component {

    render() {
        const { images } = this.props;

        let addedImagesDisplay = <span className="font-weight-bold">NONE</span>;

        if (images && images.length) {
            let addedImagesList = [];

            for (const image of images) {
                addedImagesList.push(<li className="added" key={image.name}>{image.name}</li>);
            }

            addedImagesDisplay = <ul>{addedImagesList}</ul>;
        }

        return (
            <div>
                <span className="font-weight-bold">Added Images:&nbsp;</span>
                {addedImagesDisplay}
            </div>
        );
    }
}