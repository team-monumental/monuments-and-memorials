import {
    FETCH_CREATE_SUGGESTIONS_PENDING, FETCH_CREATE_SUGGESTIONS_SUCCESS, FETCH_CREATE_SUGGESTIONS_ERROR,
    FETCH_UPDATE_SUGGESTIONS_PENDING, FETCH_UPDATE_SUGGESTIONS_SUCCESS, FETCH_UPDATE_SUGGESTIONS_ERROR,
    FETCH_BULK_CREATE_SUGGESTIONS_PENDING, FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS, FETCH_BULK_CREATE_SUGGESTIONS_ERROR
} from '../constants';
import { pending, success, error } from '../utils/action-util';
import { get } from '../utils/api-util';

const actions = {
    fetchCreate: {
        pending: FETCH_CREATE_SUGGESTIONS_PENDING,
        success: FETCH_CREATE_SUGGESTIONS_SUCCESS,
        error: FETCH_CREATE_SUGGESTIONS_ERROR,
        uri: '/api/suggestions/create'
    },
    fetchUpdate: {
        pending: FETCH_UPDATE_SUGGESTIONS_PENDING,
        success: FETCH_UPDATE_SUGGESTIONS_SUCCESS,
        error: FETCH_UPDATE_SUGGESTIONS_ERROR,
        uri: '/api/suggestions/update'
    },
    fetchBulkCreate: {
        pending: FETCH_BULK_CREATE_SUGGESTIONS_PENDING,
        success: FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS,
        error: FETCH_BULK_CREATE_SUGGESTIONS_ERROR,
        uri: '/api/suggestions/bulk'
    }
};

function fetchSuggestions(action) {
    return async dispatch => {
        dispatch(pending(action));

        try {
            const suggestions = await get(action.uri);
            dispatch(success(action, suggestions));
        } catch (err) {
            dispatch(error(action, err.message));
        }
    }
}

export function fetchCreateSuggestions() {
    return fetchSuggestions(actions.fetchCreate);
}

export function fetchUpdateSuggestions() {
    return fetchSuggestions(actions.fetchUpdate);
}

export function fetchBulkCreateSuggestions() {
    return fetchSuggestions(actions.fetchBulkCreate);
}