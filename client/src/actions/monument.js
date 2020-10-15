import {
    FETCH_MONUMENT_PENDING,
    FETCH_MONUMENT_ERROR,
    FETCH_MONUMENT_SUCCESS,
    FETCH_NEARBY_MONUMENTS_PENDING,
    FETCH_NEARBY_MONUMENTS_SUCCESS,
    FETCH_NEARBY_MONUMENTS_ERROR,
    FETCH_RELATED_MONUMENTS_PENDING,
    FETCH_RELATED_MONUMENTS_SUCCESS,
    FETCH_RELATED_MONUMENTS_ERROR,
    FETCH_FAVORITE_PENDING,
    FETCH_FAVORITE_SUCCESS,
    FETCH_FAVORITE_ERROR,
    CREATE_FAVORITE_ERROR,
    CREATE_FAVORITE_PENDING,
    CREATE_FAVORITE_SUCCESS,
    DELETE_FAVORITE_ERROR,
    DELETE_FAVORITE_PENDING,
    DELETE_FAVORITE_SUCCESS,
    FETCH_ALL_MONUMENTS_PENDING,
    FETCH_ALL_MONUMENTS_SUCCESS,
    FETCH_ALL_MONUMENTS_ERROR
} from '../constants';
import * as QueryString from 'query-string';
import { get, post, del } from '../utils/api-util';
import { addError } from './errors';
import { pending, success, error } from '../utils/action-util';

const actions = {
    single: {
        pending: FETCH_MONUMENT_PENDING,
        success: FETCH_MONUMENT_SUCCESS,
        error: FETCH_MONUMENT_ERROR
    },
    all: {
        pending: FETCH_ALL_MONUMENTS_PENDING,
        success: FETCH_ALL_MONUMENTS_SUCCESS,
        error: FETCH_ALL_MONUMENTS_ERROR
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
    },
    favorite: {
        fetch: {
            pending: FETCH_FAVORITE_PENDING,
            success: FETCH_FAVORITE_SUCCESS,
            error: FETCH_FAVORITE_ERROR,
            uri: '/api/favorite'
        },
        create: {
            pending: CREATE_FAVORITE_PENDING,
            success: CREATE_FAVORITE_SUCCESS,
            error: CREATE_FAVORITE_ERROR,
            uri: '/api/favorite'
        },
        delete: {
            pending: DELETE_FAVORITE_PENDING,
            success: DELETE_FAVORITE_SUCCESS,
            error: DELETE_FAVORITE_ERROR,
            uri: '/api/favorite'
        }
    }
};

/**
 * Queries for a monument and all related records, to be displayed on the monument view page
 * After the Monument is successfully retrieved, queries for the nearby Monuments and the related Monuments
 * This is an async action (redux-thunk)
 */
export default function fetchMonument(id, onlyActive) {
    return async dispatch => {
        dispatch(pending(actions.single));

        try {
            const monument = await get(`/api/monument/${id}?cascade=true${onlyActive !== undefined ? `&onlyActive=${onlyActive}` : ''}`);
            dispatch(success(actions.single, monument));

            await fetchNearbyMonuments(dispatch, monument);
            await fetchRelatedMonuments(dispatch, monument);
        } catch (err) {
            dispatch(error(actions.single, err));
            dispatch(addError({
                message: err.message
            }));
        }
    }
}

export function fetchAllMonuments(dispatch, onlyActive=true) {
    return async dispatch => {
        dispatch(pending(actions.all));

        let queryOptions = {
            onlyActive
        };
        let queryString = QueryString.stringify(queryOptions);

        try {
            const allMonuments = await get(`/api/monuments/?cascade=true&${queryString}`);
            dispatch(success(actions.all, allMonuments));
        } catch (err) {
            dispatch(error(actions.all, err));
        }
    }
}

async function fetchNearbyMonuments(dispatch, monument) {
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
}

async function fetchRelatedMonuments(dispatch, monument) {
    let tagNames = [];
    if (monument.monumentTags) {
        tagNames = monument.monumentTags.map(monumentTag => monumentTag.tag.name);
    }

    if (tagNames.length > 0) {
        let queryOptions = {
            tags: tagNames,
            limit: 5,
            monumentId: monument.id
        };

        let queryString = QueryString.stringify(queryOptions, {arrayFormat: 'comma'});

        dispatch(pending(actions.related));
        try {
            const relatedMonuments = await get(`/api/monuments/related/?${queryString}`);
            dispatch(success(actions.related, relatedMonuments));
        } catch (err) {
            dispatch(pending(actions.related, err));
        }
    }
}

export function fetchFavorite(monumentId) {
    return async dispatch => {
        dispatch(pending(actions.favorite.fetch));
        try {
            const result = await get(actions.favorite.fetch.uri + '?monumentId=' + monumentId, {returnFullError: true});
            dispatch(success(actions.favorite.fetch, {result: result}));
        } catch (err) {
            if (err.status === 404) {
                dispatch(success(actions.favorite.fetch, {result: null}));
            } else {
                const message = JSON.parse(await err.text()).message;
                dispatch(error(actions.favorite.fetch, message));
            }
        }
    }
}

export function createFavorite(monument) {
    return async dispatch => {
        dispatch(pending(actions.favorite.create));
        try {
            const result = await post(actions.favorite.create.uri, {
                monumentId: monument.id
            });
            dispatch(success(actions.favorite.create, {result: result}));
            dispatch(success(actions.favorite.fetch, {result: result}));
        } catch (err) {
            dispatch(error(actions.favorite.delete, err));
        }
    }
}

export function deleteFavorite(monument) {
    return async dispatch => {
        dispatch(pending(actions.favorite.delete));
        try {
            const result = await del(actions.favorite.delete.uri, {
                monumentId: monument.id
            });
            dispatch(success(actions.favorite.delete, {success: result}));
            dispatch(success(actions.favorite.fetch, {result: null}));
        } catch (err) {
            dispatch(error(actions.favorite.delete, err));
        }
    }
}
