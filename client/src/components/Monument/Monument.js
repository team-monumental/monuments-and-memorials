import React from 'react';
import './Monument.scss';
import Details from './Details/Details';
import SuggestChanges from '../SuggestChanges/SuggestChanges';
import MapPhotoSphereTabs from './MapPhotoSphereTabs/MapPhotoSphereTabs';
import RelatedMonuments from './RelatedMonuments/RelatedMonuments';

/**
 * Root presentational component for the Monument record page
 */
export default class Monument extends React.Component {

    render() {
        const {onSuggestChangesButtonClick, userRole} = this.props;

        let {
            monument, nearbyMonuments, relatedMonuments, fetchNearbyPending, fetchRelatedPending, onToggleFavorite,
            favorite, fetchFavoritePending, showFavorite
        } = this.props;

        if (nearbyMonuments && nearbyMonuments.length) {
            nearbyMonuments = nearbyMonuments.filter(nearbyMonument => nearbyMonument.id !== monument.id);
        }
        if (relatedMonuments && relatedMonuments.length) {
            relatedMonuments = relatedMonuments.filter(relatedMonument => relatedMonument.id !== monument.id);
        }
        if (!monument) return (<div/>);

        return (
            <div className="monument-page-container">
                <div className="column main-column">
                    <Details monument={monument} favorite={favorite} fetchFavoritePending={fetchFavoritePending}
                             onToggleFavorite={() => onToggleFavorite()} showFavorite={showFavorite}/>
                </div>
                <div className="column related-monuments-column">
                    <SuggestChanges mode="update" userRole={userRole}
                                    onButtonClick={() => onSuggestChangesButtonClick()}/>
                    <RelatedMonuments title="Nearby Monuments or Memorials" monuments={nearbyMonuments}
                                      pending={fetchNearbyPending}/>
                    <RelatedMonuments title="Related Monuments or Memorials" monuments={relatedMonuments}
                                      pending={fetchRelatedPending}/>
                </div>
                <div className="column visit-column">
                    <MapPhotoSphereTabs monument={monument}/>
                </div>
            </div>
        )
    }
}
