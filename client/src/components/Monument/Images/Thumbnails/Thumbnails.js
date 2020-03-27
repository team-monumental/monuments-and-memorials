import * as React from 'react';
import './Thumbnails.scss';
import Thumbnail from './Thumbnail/Thumbnail';

export default class Thumbnails extends React.Component {

    render() {
        const { imageUrls } = this.props;

        return (<>
            {imageUrls && <div className="images">
                {imageUrls.map(imageUrl => (
                    <Thumbnail key={imageUrl} imageUrl={imageUrl}/>
                ))}
            </div>}
        </>);
    }
}