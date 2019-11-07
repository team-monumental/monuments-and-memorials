import * as React from 'react';
import './MapPhotoSphereTabs.scss';
import Map from './Map/Map';
import { Tab, Tabs } from 'react-bootstrap';

export default class MapPhotoSphereTabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'images',
            activeImageIndex: 0
        };
    }

    render() {
        const { monument } = this.props;
        const { activeTab, activeImageIndex } = this.state;
        const photoSphereImages = (monument.images || []).filter(image => image.isPhotoSphere);

        const map = (<Map monument={monument}/>);

        if (!photoSphereImages.length) {
            return map;
        }

        const pagination = (
            <div className="image-selection">
                {
                    photoSphereImages.map((image, index) => {
                        let className = 'image-option';
                        if (index === activeImageIndex) {
                            className += ' selected';
                        }
                        return (
                            <span key={image.id} className={className}
                                  onClick={() => this.setState({activeImageIndex: index})}/>
                        );
                    })
                }
            </div>
        );

        const activePhotoSphereImage = photoSphereImages.find((image, index) => index === activeImageIndex);

        return (
            <Tabs id="map_photo_sphere_tabs" activeKey={activeTab} onSelect={key => this.setState({activeTab: key})}>
                <Tab eventKey="images" title="360&deg; view">
                    <div className="tab-content-wrapper">
                        {activePhotoSphereImage && (
                            <iframe src={activePhotoSphereImage.url} frameBorder="0" allowFullScreen/>
                        )}
                        {photoSphereImages.length > 1 && pagination}
                    </div>
                </Tab>
                <Tab eventKey="map" title="Map">
                    <div className="tab-content-wrapper">
                        {map}
                    </div>
                </Tab>
            </Tabs>
        );
    }
}