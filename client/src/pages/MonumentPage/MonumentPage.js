import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Monument from '../../components/Monument/Monument';
import Spinner from '../../components/Spinner/Spinner';
import fetchMonument, { createFavorite, deleteFavorite, fetchFavorite } from '../../actions/monument';
import * as slugify from 'slugify';
import { Helmet } from 'react-helmet';

/**
 * Root container component for the monument record page which handles retrieving the monument
 * and its related records via redux
 */
class MonumentPage extends React.Component {

    static mapStateToProps(state) {
        return {
            ...state.monumentPage,
            createFavorite: state.createFavorite,
            deleteFavorite: state.deleteFavorite,
            session: state.session
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { dispatch, session, match: { params: { monumentId } } } = this.props;
        if (prevProps.session.pending && !session.pending && session.user) {
            dispatch(fetchFavorite(monumentId));
        }
    }

    componentDidMount() {
        const { dispatch, match: { params: { monumentId } } } = this.props;
        dispatch(fetchMonument(monumentId));
    }

    /**
     * This function encapsulates the logic to add the slug at the end of the url if it's not present
     */
    redirectToSlug() {
        const { monument, match, history } = this.props;
        const slug = match.params.slug;
        // Wait for the monument to be loaded in from the API
        // If there's no title, slugify will throw an error, so only proceed if there's a title
        if (!monument || !monument.title) return;
        // Slugify the monument's title
        const newSlug = slugify(monument.title, {
            remove: /[^a-zA-Z0-9\s]/g,
        });
        // Don't redirect if the correct slug is already present
        if (slug !== newSlug) {
            history.replace(`/monuments/${monument.id}/${newSlug}`);
        }
    }

    handleToggleFavorite() {
        const { favorite, monument, dispatch } = this.props;
        if (favorite) {
            dispatch(deleteFavorite(monument));
        } else {
            dispatch(createFavorite(monument));
        }
    }

    render() {
        // Change the url to include the slug if it's not present
        this.redirectToSlug();
        const {
            monument, nearbyMonuments, relatedMonuments, favorite, session,
            fetchMonumentPending, fetchNearbyPending, fetchRelatedPending, fetchFavoritePending
        } = this.props;
        return (
            <div className="page h-100">
                {monument && <Helmet title={monument.title + ' | Monuments and Memorials'}/>}
                <Spinner show={fetchMonumentPending}/>
                <Monument monument={monument} nearbyMonuments={nearbyMonuments} relatedMonuments={relatedMonuments}
                          fetchNearbyPending={fetchNearbyPending} fetchRelatedPending={fetchRelatedPending}
                          fetchFavoritePending={fetchFavoritePending} favorite={favorite}
                          onToggleFavorite={() => this.handleToggleFavorite()} showFavorite={!!session.user}/>
            </div>
        );
    }
}

export default withRouter(connect(MonumentPage.mapStateToProps)(MonumentPage));
