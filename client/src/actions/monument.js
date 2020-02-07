import { FETCH_MONUMENT_PENDING, FETCH_MONUMENT_ERROR, FETCH_MONUMENT_SUCCESS, FETCH_NEARBY_MONUMENTS_PENDING,
    FETCH_NEARBY_MONUMENTS_SUCCESS, FETCH_NEARBY_MONUMENTS_ERROR, FETCH_RELATED_MONUMENTS_PENDING,
    FETCH_RELATED_MONUMENTS_SUCCESS, FETCH_RELATED_MONUMENTS_ERROR
} from '../constants';
import * as QueryString from 'query-string';
import { get } from '../utils/api-util';
import { addError } from './errors';

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

        try {
            const monument = await get(`/api/monument/${id}?cascade=true`);
            dispatch(fetchMonumentSuccess(monument));

            let queryOptions = {
                lat: monument.lat,
                lon: monument.lon,
                d: 25,
                limit: 5,
                sort: 'distance'
            };

            let queryString = QueryString.stringify(queryOptions);

            dispatch(fetchNearbyMonumentsPending());
            try {
                const nearbyMonuments = await get(`/api/search/monuments/?${queryString}`);
                dispatch(fetchNearbyMonumentsSuccess(nearbyMonuments));
            } catch (error) {
                dispatch(fetchNearbyMonumentsError(error));
            }

            let tagNames = [];
            if (monument.monumentTags) {
                tagNames = monument.monumentTags.map(monumentTag => monumentTag.tag.name);
            }

            if (tagNames.length > 0) {
                queryOptions = {
                    tags: tagNames,
                    limit: 5,
                    monumentId: id
                };

                queryString = QueryString.stringify(queryOptions, {arrayFormat: 'comma'});

                dispatch(fetchRelatedMonumentsPending());
                try {
                    const relatedMonuments = await get(`/api/monuments/related/?${queryString}`);
                    dispatch(fetchRelatedMonumentsSuccess(relatedMonuments));
                } catch (error) {
                    dispatch(fetchRelatedMonumentsError(error));
                }
            }
        } catch (error) {
            dispatch(fetchMonumentError(error));
            dispatch(addError({
                message: error.message
            }));
        }
    }
}
