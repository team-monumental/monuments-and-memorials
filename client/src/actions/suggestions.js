import {
    FETCH_CREATE_SUGGESTIONS_PENDING, FETCH_CREATE_SUGGESTIONS_SUCCESS, FETCH_CREATE_SUGGESTIONS_ERROR,
    FETCH_UPDATE_SUGGESTIONS_PENDING, FETCH_UPDATE_SUGGESTIONS_SUCCESS, FETCH_UPDATE_SUGGESTIONS_ERROR,
    FETCH_BULK_CREATE_SUGGESTIONS_PENDING, FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS, FETCH_BULK_CREATE_SUGGESTIONS_ERROR,
    FETCH_CREATE_SUGGESTION_PENDING, FETCH_CREATE_SUGGESTION_SUCCESS, FETCH_CREATE_SUGGESTION_ERROR,
    FETCH_UPDATE_SUGGESTION_PENDING, FETCH_UPDATE_SUGGESTION_SUCCESS, FETCH_UPDATE_SUGGESTION_ERROR,
    FETCH_BULK_CREATE_SUGGESTION_PENDING, FETCH_BULK_CREATE_SUGGESTION_SUCCESS, FETCH_BULK_CREATE_SUGGESTION_ERROR,
    APPROVE_CREATE_SUGGESTION_PENDING, APPROVE_CREATE_SUGGESTION_SUCCESS, APPROVE_CREATE_SUGGESTION_ERROR
} from '../constants';
import { pending, success, error } from '../utils/action-util';
import { get, put } from '../utils/api-util';

const actions = {
    fetchCreates: {
        pending: FETCH_CREATE_SUGGESTIONS_PENDING,
        success: FETCH_CREATE_SUGGESTIONS_SUCCESS,
        error: FETCH_CREATE_SUGGESTIONS_ERROR,
        uri: '/api/suggestions/create'
    },
    fetchUpdates: {
        pending: FETCH_UPDATE_SUGGESTIONS_PENDING,
        success: FETCH_UPDATE_SUGGESTIONS_SUCCESS,
        error: FETCH_UPDATE_SUGGESTIONS_ERROR,
        uri: '/api/suggestions/update'
    },
    fetchBulkCreates: {
        pending: FETCH_BULK_CREATE_SUGGESTIONS_PENDING,
        success: FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS,
        error: FETCH_BULK_CREATE_SUGGESTIONS_ERROR,
        uri: '/api/suggestions/bulk'
    },
    fetchCreate: {
        pending: FETCH_CREATE_SUGGESTION_PENDING,
        success: FETCH_CREATE_SUGGESTION_SUCCESS,
        error: FETCH_CREATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/create'
    },
    fetchUpdate: {
        pending: FETCH_UPDATE_SUGGESTION_PENDING,
        success: FETCH_UPDATE_SUGGESTION_SUCCESS,
        error: FETCH_UPDATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/update'
    },
    fetchBulkCreate: {
        pending: FETCH_BULK_CREATE_SUGGESTION_PENDING,
        success: FETCH_BULK_CREATE_SUGGESTION_SUCCESS,
        error: FETCH_BULK_CREATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/bulk'
    },
    approveCreate: {
        pending: APPROVE_CREATE_SUGGESTION_PENDING,
        success: APPROVE_CREATE_SUGGESTION_SUCCESS,
        error: APPROVE_CREATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/create'
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
    };
}

export function fetchCreateSuggestions() {
    return fetchSuggestions(actions.fetchCreates);
}

export function fetchUpdateSuggestions() {
    return fetchSuggestions(actions.fetchUpdates);
}

export function fetchBulkCreateSuggestions() {
    return fetchSuggestions(actions.fetchBulkCreates);
}

function fetchSuggestion(action, id) {
    return async dispatch => {
        dispatch(pending(action));

        try {
            const suggestion = await get(`${action.uri}/${id}`);
            dispatch(success(action, suggestion));
        } catch (err) {
            dispatch(error(action, err.message));
        }
    };
}

export function fetchCreateSuggestion(id) {
    return fetchSuggestion(actions.fetchCreate, id);
}

export function fetchUpdateSuggestion(id) {
    return fetchSuggestion(actions.fetchUpdate, id);
}

export function fetchBulkCreateSuggestion(id) {
    return fetchSuggestion(actions.fetchBulkCreate, id);
}

function approveSuggestion(action, id) {
    return async dispatch => {
        dispatch(pending(action));

        try {
            const approvedSuggestion = await put(`${action.uri}/${id}/approve`);
            dispatch(success(action, approvedSuggestion));
        } catch (err) {
            dispatch(error(action, err.message));
        }
    };
}

export function approveCreateSuggestion(id) {
    return approveSuggestion(actions.approveCreate, id);
}