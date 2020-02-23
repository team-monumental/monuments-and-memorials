import React from 'react';
import './Monument.scss';
import Details from './Details/Details';
import SuggestChanges from './SuggestChanges/SuggestChanges';
import MapPhotoSphereTabs from './MapPhotoSphereTabs/MapPhotoSphereTabs';
import RelatedMonuments from "./RelatedMonuments/RelatedMonuments";

/**
 * Root presentational component for the Monument record page
 */
export default class Monument extends React.Component {

    render() {

        let { monument, nearbyMonuments, relatedMonuments, fetchNearbyPending, fetchRelatedPending } = this.props;
        if (nearbyMonuments && nearbyMonuments.length) {
            nearbyMonuments = nearbyMonuments.filter(nearbyMonument => nearbyMonument.id !== monument.id);
        }
        if (relatedMonuments && relatedMonuments.length) {
            relatedMonuments = relatedMonuments.filter(relatedMonument => relatedMonument.id !== monument.id);
        }
        if (!monument) return (<div/>);
        const title = monument.title;

        return (
            <div className="page-container">
                <div className="column related-monuments-column">
                    <SuggestChanges/>
                    <RelatedMonuments title="Nearby Monuments or Memorials" monuments={nearbyMonuments} pending={fetchNearbyPending}/>
                    <RelatedMonuments title="Related Monuments or Memorials" monuments={relatedMonuments} pending={fetchRelatedPending}/>
                </div>
                <div className="column main-column">
                    <Details monument={monument}/>
                </div>
                <div className="column visit-column">
                    <MapPhotoSphereTabs monument={monument}/>
                </div>
            </div>
        )
    }
}
