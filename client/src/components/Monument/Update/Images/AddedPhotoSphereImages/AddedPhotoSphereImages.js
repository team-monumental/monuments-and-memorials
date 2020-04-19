import * as React from 'react';
import './AddedPhotoSphereImages.scss';

/**
 * Presentational component for rendering added PhotoSphere Images for a Monument
 */
export default class AddedPhotoSphereImages extends React.Component {

    render() {
        const { images } = this.props;

        let addedImagesDisplay = <span className="font-weight-bold">NONE</span>;

        if (images && images.length) {
            let addedImagesList = [];

            for (const addedImage of images) {
                addedImagesList.push(<div className="added" key={addedImage.url}>
                    <div className="photosphere-preview">
                        <iframe title="PhotoSphere" src={addedImage.url} frameBorder="0"/>
                    </div>
                </div>);
            }

            addedImagesDisplay = <ul>{addedImagesList}</ul>;
        }

        return (
            <div>
                <span className="font-weight-bold">Added 360° Images:&nbsp;</span>
                {addedImagesDisplay}
            </div>
        )
    }
}