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
import { LOCATION_CHANGE } from 'connected-react-router';
import basicReducer from '../utils/basic-reducer';

const initialState = {
    pending: false,
    result: null,
    error: null
};

export function fetchCreateSuggestions(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: FETCH_CREATE_SUGGESTIONS_PENDING,
        success: FETCH_CREATE_SUGGESTIONS_SUCCESS,
        error: FETCH_CREATE_SUGGESTIONS_ERROR
    }, false);
}

export function fetchUpdateSuggestions(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: FETCH_UPDATE_SUGGESTIONS_PENDING,
        success: FETCH_UPDATE_SUGGESTIONS_SUCCESS,
        error: FETCH_UPDATE_SUGGESTIONS_ERROR
    }, false);
}

export function fetchBulkCreateSuggestions(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: FETCH_BULK_CREATE_SUGGESTIONS_PENDING,
        success: FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS,
        error: FETCH_BULK_CREATE_SUGGESTIONS_ERROR
    }, false);
}

export function fetchCreateSuggestion(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: FETCH_CREATE_SUGGESTION_PENDING,
        success: FETCH_CREATE_SUGGESTION_SUCCESS,
        error: FETCH_CREATE_SUGGESTION_ERROR
    });
}

export function fetchUpdateSuggestion(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: FETCH_UPDATE_SUGGESTION_PENDING,
        success: FETCH_UPDATE_SUGGESTION_SUCCESS,
        error: FETCH_UPDATE_SUGGESTION_ERROR
    });
}

export function fetchBulkCreateSuggestion(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: FETCH_BULK_CREATE_SUGGESTION_PENDING,
        success: FETCH_BULK_CREATE_SUGGESTION_SUCCESS,
        error: FETCH_BULK_CREATE_SUGGESTION_ERROR
    });
}

export function approveCreateSuggestion(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: APPROVE_CREATE_SUGGESTION_PENDING,
        success: APPROVE_CREATE_SUGGESTION_SUCCESS,
        error: APPROVE_CREATE_SUGGESTION_ERROR
    });
}

export function rejectCreateSuggestion(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: REJECT_CREATE_SUGGESTION_PENDING,
        success: REJECT_CREATE_SUGGESTION_SUCCESS,
        error: REJECT_CREATE_SUGGESTION_ERROR
    });
}

export function approveUpdateSuggestion(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: APPROVE_UPDATE_SUGGESTION_PENDING,
        success: APPROVE_UPDATE_SUGGESTION_SUCCESS,
        error: APPROVE_UPDATE_SUGGESTION_ERROR
    });
}

export function rejectUpdateSuggestion(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: REJECT_UPDATE_SUGGESTION_PENDING,
        success: REJECT_UPDATE_SUGGESTION_SUCCESS,
        error: REJECT_UPDATE_SUGGESTION_ERROR
    });
}

export function approveBulkCreateSuggestion(state = initialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return initialState;
        case APPROVE_BULK_CREATE_SUGGESTION_PENDING:
            return {
                ...state,
                pending: true,
                progress: action.progress
            };
        case APPROVE_BULK_CREATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case APPROVE_BULK_CREATE_SUGGESTION_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function rejectBulkCreateSuggestion(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: REJECT_BULK_CREATE_SUGGESTION_PENDING,
        success: REJECT_BULK_CREATE_SUGGESTION_SUCCESS,
        error: REJECT_BULK_CREATE_SUGGESTION_ERROR
    });
}