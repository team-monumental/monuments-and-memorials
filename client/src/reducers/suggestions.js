import {
    FETCH_CREATE_SUGGESTIONS_PENDING, FETCH_CREATE_SUGGESTIONS_SUCCESS, FETCH_CREATE_SUGGESTIONS_ERROR,
    FETCH_UPDATE_SUGGESTIONS_PENDING, FETCH_UPDATE_SUGGESTIONS_SUCCESS, FETCH_UPDATE_SUGGESTIONS_ERROR,
    FETCH_BULK_CREATE_SUGGESTIONS_PENDING, FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS, FETCH_BULK_CREATE_SUGGESTIONS_ERROR
} from '../constants';
import basicReducer from '../utils/basic-reducer';

const initialState = {
    pending: false,
    result: null,
    error: null
};

export function fetchCreateSuggestions(state = initialState, action) {
    return basicReducer(state, action, {
        pending: FETCH_CREATE_SUGGESTIONS_PENDING,
        success: FETCH_CREATE_SUGGESTIONS_SUCCESS,
        error: FETCH_CREATE_SUGGESTIONS_ERROR
    });
}

export function fetchUpdateSuggestions(state = initialState, action) {
    return basicReducer(state, action, {
        pending: FETCH_UPDATE_SUGGESTIONS_PENDING,
        success: FETCH_UPDATE_SUGGESTIONS_SUCCESS,
        error: FETCH_UPDATE_SUGGESTIONS_ERROR
    });
}

export function fetchBulkCreateSuggestions(state = initialState, action) {
    return basicReducer(state, action, {
        pending: FETCH_BULK_CREATE_SUGGESTIONS_PENDING,
        success: FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS,
        error: FETCH_BULK_CREATE_SUGGESTIONS_ERROR
    });
}