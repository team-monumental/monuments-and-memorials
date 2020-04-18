import {
    FETCH_CREATE_SUGGESTIONS_PENDING, FETCH_CREATE_SUGGESTIONS_SUCCESS, FETCH_CREATE_SUGGESTIONS_ERROR,
    FETCH_UPDATE_SUGGESTIONS_PENDING, FETCH_UPDATE_SUGGESTIONS_SUCCESS, FETCH_UPDATE_SUGGESTIONS_ERROR,
    FETCH_BULK_CREATE_SUGGESTIONS_PENDING, FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS, FETCH_BULK_CREATE_SUGGESTIONS_ERROR,
    FETCH_CREATE_SUGGESTION_PENDING, FETCH_CREATE_SUGGESTION_SUCCESS, FETCH_CREATE_SUGGESTION_ERROR,
    FETCH_UPDATE_SUGGESTION_PENDING, FETCH_UPDATE_SUGGESTION_SUCCESS, FETCH_UPDATE_SUGGESTION_ERROR,
    FETCH_BULK_CREATE_SUGGESTION_PENDING, FETCH_BULK_CREATE_SUGGESTION_SUCCESS, FETCH_BULK_CREATE_SUGGESTION_ERROR,
    APPROVE_CREATE_SUGGESTION_PENDING, APPROVE_CREATE_SUGGESTION_SUCCESS, APPROVE_CREATE_SUGGESTION_ERROR,
    REJECT_CREATE_SUGGESTION_PENDING, REJECT_CREATE_SUGGESTION_SUCCESS, REJECT_CREATE_SUGGESTION_ERROR,
    APPROVE_UPDATE_SUGGESTION_PENDING, APPROVE_UPDATE_SUGGESTION_SUCCESS, APPROVE_UPDATE_SUGGESTION_ERROR,
    REJECT_UPDATE_SUGGESTION_PENDING, REJECT_UPDATE_SUGGESTION_SUCCESS, REJECT_UPDATE_SUGGESTION_ERROR,
    APPROVE_BULK_CREATE_SUGGESTION_PENDING, APPROVE_BULK_CREATE_SUGGESTION_SUCCESS, APPROVE_BULK_CREATE_SUGGESTION_ERROR,
    REJECT_BULK_CREATE_SUGGESTION_PENDING, REJECT_BULK_CREATE_SUGGESTION_SUCCESS, REJECT_BULK_CREATE_SUGGESTION_ERROR
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
    },
    rejectCreate: {
        pending: REJECT_CREATE_SUGGESTION_PENDING,
        success: REJECT_CREATE_SUGGESTION_SUCCESS,
        error: REJECT_CREATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/create'
    },
    approveUpdate: {
        pending: APPROVE_UPDATE_SUGGESTION_PENDING,
        success: APPROVE_UPDATE_SUGGESTION_SUCCESS,
        error: APPROVE_UPDATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/update'
    },
    rejectUpdate: {
        pending: REJECT_UPDATE_SUGGESTION_PENDING,
        success: REJECT_UPDATE_SUGGESTION_SUCCESS,
        error: REJECT_UPDATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/update'
    },
    approveBulkCreate: {
        pending: APPROVE_BULK_CREATE_SUGGESTION_PENDING,
        success: APPROVE_BULK_CREATE_SUGGESTION_SUCCESS,
        error: APPROVE_BULK_CREATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/bulk'
    },
    rejectBulkCreate: {
        pending: REJECT_BULK_CREATE_SUGGESTION_PENDING,
        success: REJECT_BULK_CREATE_SUGGESTION_SUCCESS,
        error: REJECT_BULK_CREATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/bulk'
    }
};

function fetchSuggestions(action) {
    return async dispatch => {
        dispatch(pending(action));

        try {
            const result = await get(action.uri);
            dispatch(success(action, {result}));
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

function fetchSuggestion(action, id, isUpdateSuggestion=false) {
    return async dispatch => {
        dispatch(pending(action));

        try {
            const suggestion = await get(`${action.uri}/${id}`);

            // Special case for UpdateMonumentSuggestions: Fetch all of the pending UpdateMonumentSuggestions for the
            // Monument
            if (isUpdateSuggestion) {
                const allPendingUpdateSuggestionsForMonument = await get(`/api/search/suggestions/update/pending/${suggestion.monument.id}`);
                const result = {
                    suggestion: suggestion,
                    allPendingForMonument: allPendingUpdateSuggestionsForMonument
                };
                dispatch(success(action, {result}));
            }
            else {
                dispatch(success(action, {result: suggestion}));
            }
        } catch (err) {
            dispatch(error(action, err.message));
        }
    };
}

export function fetchCreateSuggestion(id) {
    return fetchSuggestion(actions.fetchCreate, id);
}

export function fetchUpdateSuggestion(id) {
    return fetchSuggestion(actions.fetchUpdate, id, true);
}

export function fetchBulkCreateSuggestion(id) {
    return fetchSuggestion(actions.fetchBulkCreate, id);
}

function approveSuggestion(action, id) {
    return async dispatch => {
        dispatch(pending(action));

        try {
            const result = await put(`${action.uri}/${id}/approve`);
            dispatch(success(action, {result}));
        } catch (err) {
            dispatch(error(action, err.message));
        }
    };
}

export function approveCreateSuggestion(id) {
    return approveSuggestion(actions.approveCreate, id);
}

export function approveUpdateSuggestion(id) {
    return approveSuggestion(actions.approveUpdate, id);
}

export function approveBulkCreateSuggestion(id) {
    return async dispatch => {
        dispatch(pending(actions.approveBulkCreate));

        try {
            let approveResult = await put(`${actions.approveBulkCreate.uri}/${id}/approve`);

            const approveJobId = approveResult.id;

            let interval;
            await new Promise(resolve => {
                interval = window.setInterval(async() => {
                    approveResult = await (await fetch(`${actions.approveBulkCreate.uri}/approve/progress/${approveJobId}`)).json();
                    dispatch(pending(actions.approveBulkCreate, approveResult.progress));

                    if (approveResult.future && approveResult.future.done) resolve();
                }, 200);
            });
            window.clearInterval(interval);

            approveResult = await (await fetch(`${actions.approveBulkCreate.uri}/approve/result/${approveJobId}`)).json();
            dispatch(success(actions.approveBulkCreate, approveResult));
        } catch (err) {
            dispatch(error(actions.approveBulkCreate, err));
        }
    };
}

function rejectSuggestion(action, id) {
    return async dispatch => {
        dispatch(pending(action));

        try {
            const result = await put(`${action.uri}/${id}/reject`);
            dispatch(success(action, {result}));
        } catch (err) {
            dispatch(error(action, err.message));
        }
    };
}

export function rejectCreateSuggestion(id) {
    return rejectSuggestion(actions.rejectCreate, id);
}

export function rejectUpdateSuggestion(id) {
    return rejectSuggestion(actions.rejectUpdate, id);
}

export function rejectBulkCreateSuggestion(id) {
    return rejectSuggestion(actions.rejectBulkCreate, id);
}