import { FETCH_MONUMENT_PENDING, FETCH_MONUMENT_ERROR, FETCH_MONUMENT_SUCCESS, FETCH_NEARBY_MONUMENTS_PENDING,
    FETCH_NEARBY_MONUMENTS_SUCCESS, FETCH_NEARBY_MONUMENTS_ERROR, FETCH_RELATED_MONUMENTS_PENDING,
    FETCH_RELATED_MONUMENTS_SUCCESS, FETCH_RELATED_MONUMENTS_ERROR
} from '../constants';
import * as QueryString from 'query-string';
import { get } from '../utils/api-util';
import { addError } from './errors';
import { pending, success, error } from '../utils/action-util';

const actions = {
    single: {
        pending: FETCH_MONUMENT_PENDING,
        success: FETCH_MONUMENT_SUCCESS,
        error: FETCH_MONUMENT_ERROR
    },
    nearby: {
        pending: FETCH_NEARBY_MONUMENTS_PENDING,
        success: FETCH_NEARBY_MONUMENTS_SUCCESS,
        error: FETCH_NEARBY_MONUMENTS_ERROR
    },
    related: {
        pending: FETCH_RELATED_MONUMENTS_PENDING,
        success: FETCH_RELATED_MONUMENTS_SUCCESS,
        error: FETCH_RELATED_MONUMENTS_ERROR
    }
};

/**
 * Queries for a monument and all related records, to be displayed on the monument view page
 * After the Monument is successfully retrieved, queries for the nearby Monuments and the related Monuments
 * This is an async action (redux-thunk)
 */
export default function fetchMonument(id) {
    return async dispatch => {
        dispatch(pending(actions.single));

        try {
            const monument = await get(`/api/monument/${id}?cascade=true`);
            dispatch(success(actions.single, monument));

            let queryOptions = {
                lat: monument.lat,
                lon: monument.lon,
                d: 25,
                limit: 5,
                sort: 'distance'
            };

            let queryString = QueryString.stringify(queryOptions);

            dispatch(pending(actions.nearby));
            try {
                const nearbyMonuments = await get(`/api/search/monuments/?${queryString}`);
                dispatch(success(actions.nearby, nearbyMonuments));
            } catch (err) {
                dispatch(error(actions.nearby, err));
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

                dispatch(pending(actions.related));
                try {
                    const relatedMonuments = await get(`/api/monuments/related/?${queryString}`);
                    dispatch(success(actions.related, relatedMonuments));
                } catch (err) {
                    dispatch(pending(actions.related, err));
                }
            }
        } catch (err) {
            dispatch(error(actions.single, err));
            dispatch(addError({
                message: err.message
            }));
        }
    }
}
