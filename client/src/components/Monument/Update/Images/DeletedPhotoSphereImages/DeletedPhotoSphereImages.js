import * as React from 'react';
import './DeletedPhotoSphereImages.scss';

/**
 * Presentational component for rendering deleted PhotoSphere Images for a Monument
 */
export default class DeletedPhotoSphereImages extends React.Component {

    render() {
        const { deletedImageUrls } = this.props;

        let deletedImagesDisplay = <span className="font-weight-bold">NONE</span>;

        if (deletedImageUrls && deletedImageUrls.length) {
            let deletedImagesList = [];

            for (const deletedImageUrl of deletedImageUrls) {
                deletedImagesList.push(<div className="removed">
                    <div className="photosphere-preview">
                        <iframe title="PhotoSphere" src={deletedImageUrl} frameBorder="0"/>
                    </div>
                </div>);
            }

            deletedImagesDisplay = <ul>{deletedImagesList}</ul>;
        }

        return (
            <div>
                <span className="font-weight-bold">Deleted 360° Images:&nbsp;</span>
                {deletedImagesDisplay}
            </div>
        );
    }
}