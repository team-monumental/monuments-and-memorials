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

        let referenceUrl = activePhotoSphereImage.referenceUrl
        if (referenceUrl && !referenceUrl.startsWith('https://') && !referenceUrl.startsWith('http://')) {
            referenceUrl = `https://${referenceUrl}`
        }

        return (
            <Tabs id="map_photo_sphere_tabs" activeKey={activeTab} onSelect={key => this.setState({activeTab: key})}>
                <Tab eventKey="images" title="360&deg; View">
                    <div className="tab-content-wrapper">
                        {activePhotoSphereImage && (<>
                            <iframe title="PhotoSphere" src={activePhotoSphereImage.url} frameBorder="0" allowFullScreen/>
                            <div className="image-info">
                                {activePhotoSphereImage.caption && <div style={{ margin: '0 auto', textAlign: 'center' }}>
                                    {activePhotoSphereImage.caption}
                                </div>}
                                {activePhotoSphereImage.referenceUrl && <div style={{ margin: '0 auto', textAlign: 'center' }}>
                                    <span className="detail-label">Reference:&nbsp;</span>
                                    <a href={referenceUrl}>{activePhotoSphereImage.referenceUrl}</a>
                                </div>}
                            </div></>
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
