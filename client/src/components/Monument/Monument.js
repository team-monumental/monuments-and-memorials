import React from 'react';
import './Monument.scss';
import * as slugify from 'slugify';
import { Helmet } from 'react-helmet';
import Details from './Details/Details';
import SuggestChanges from './SuggestChanges/SuggestChanges';
import MapPhotoSphereTabs from './MapPhotoSphereTabs/MapPhotoSphereTabs';
import NearbyMonuments from "./NearbyMonuments/NearbyMonuments";

/**
 * Root presentational component for the Monument record page
 */
export default class Monument extends React.Component {

    render() {
        const { monument, nearbyMonuments, fetchNearbyPending } = this.props;
        if (!monument) return (<div/>);
        const title = monument.title;

        return (
            <div className="page-container">
                <Helmet title={title + ' | Monuments and Memorials'}/>
                <div className="column related-monuments-column">
                    <SuggestChanges/>
                    <NearbyMonuments monuments={nearbyMonuments} fetchNearbyPending={fetchNearbyPending}/>
                    {this.renderRelatedMonuments()}
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

    /**
     * This function encapsulates the logic to add the slug at the end of the url if it's not present
     */
    redirectToSlug() {
        const monument = this.props.monument;
        const slug = this.props.slug;
        // Wait for the monument to be loaded in from the API
        // If there's no title, slugify will throw an error, so only proceed if there's a title
        if (!monument || !monument.title) return;
        // Slugify the monument's title
        const newSlug = slugify(monument.title);
        // Don't redirect if the correct slug is already present
        if (slug !== newSlug) {
            window.location.replace(`/monuments/${monument.id}/${newSlug}`);
        }
    }
}
