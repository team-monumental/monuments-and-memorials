import { FETCH_MONUMENT_PENDING, FETCH_MONUMENT_ERROR, FETCH_MONUMENT_SUCCESS, FETCH_NEARBY_MONUMENTS_PENDING,
    FETCH_NEARBY_MONUMENTS_SUCCESS, FETCH_NEARBY_MONUMENTS_ERROR, FETCH_RELATED_MONUMENTS_PENDING,
    FETCH_RELATED_MONUMENTS_SUCCESS, FETCH_RELATED_MONUMENTS_ERROR
} from '../constants';
import * as QueryString from 'query-string';
import { get } from '../util/api-util';

function fetchMonumentPending() {
    return {
        type: FETCH_MONUMENT_PENDING
    };
}

function fetchMonumentSuccess(monument) {
    return {
        type: FETCH_MONUMENT_SUCCESS,
        payload: monument
    };
}

function fetchMonumentError(error) {
    return {
        type: FETCH_MONUMENT_ERROR,
        error: error
    };
}

function fetchNearbyMonumentsPending() {
    return {
        type: FETCH_NEARBY_MONUMENTS_PENDING
    };
}

function fetchNearbyMonumentsSuccess(monuments) {
    return {
        type: FETCH_NEARBY_MONUMENTS_SUCCESS,
        payload: monuments
    };
}

function fetchNearbyMonumentsError(error) {
    return {
        type: FETCH_NEARBY_MONUMENTS_ERROR,
        error: error
    };
}

function fetchRelatedMonumentsPending() {
    return {
        type: FETCH_RELATED_MONUMENTS_PENDING
    };
}

function fetchRelatedMonumentsSuccess(monuments) {
    return {
        type: FETCH_RELATED_MONUMENTS_SUCCESS,
        payload: monuments
    };
}

function fetchRelatedMonumentsError(error) {
    return {
        type: FETCH_RELATED_MONUMENTS_ERROR,
        error: error
    };
}

/**
 * Queries for a monument and all related records, to be displayed on the monument view page
 * After the Monument is successfully retrieved, queries for the nearby Monuments and the related Monuments
 * This is an async action (redux-thunk)
 */
export default function fetchMonument(id) {
    return async dispatch => {
        dispatch(fetchMonumentPending());
        let error = null;
        const res = await fetch(`/api/monument/${id}?cascade=true`)
            .then(res => res.json())
            .catch(err => error = err);

        if (error || res.error) dispatch(fetchMonumentError(error || res.error));
        else dispatch(fetchMonumentSuccess(res));

        let queryOptions = {
            lat: res.lat,
            lon: res.lon,
            d: 25,
            limit: 6
        };
        let queryString = QueryString.stringify(queryOptions);
        dispatch(fetchNearbyMonumentsPending());
        try {
            const nearbyMonuments = await get('/api/search/?', queryString);
            dispatch(fetchNearbyMonumentsSuccess(nearbyMonuments));
        } catch (error) {
            dispatch(fetchNearbyMonumentsError(error));
        }

        const tags = res.tags.map(tag => tag.name);
        if (tags.length > 0) {
            queryOptions = {
                tags: tags,
                limit: 6
            };
            queryString = QueryString.stringify(queryOptions, {arrayFormat: 'comma'});
            console.log(queryString);
            dispatch(fetchRelatedMonumentsPending());
            try {
                const relatedMonuments = await get('/api/search?', queryString);
                dispatch(fetchRelatedMonumentsSuccess(relatedMonuments));
            } catch (error) {
                dispatch(fetchRelatedMonumentsError(error));
            }
        }
    }
}
