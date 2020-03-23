import {
    FETCH_CREATE_SUGGESTIONS_PENDING, FETCH_CREATE_SUGGESTIONS_SUCCESS, FETCH_CREATE_SUGGESTIONS_ERROR,
    FETCH_UPDATE_SUGGESTIONS_PENDING, FETCH_UPDATE_SUGGESTIONS_SUCCESS, FETCH_UPDATE_SUGGESTIONS_ERROR,
    FETCH_BULK_CREATE_SUGGESTIONS_PENDING, FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS, FETCH_BULK_CREATE_SUGGESTIONS_ERROR
} from '../constants';

const fetchCreateInitialState = {
    pending: false,
    result: null,
    error: null
};

const fetchUpdateInitialState = {
    pending: false,
    result: null,
    error: null
};

const fetchBulkCreateInitialState = {
    pending: false,
    result: null,
    error: null
};

export function fetchCreateSuggestions(state = fetchCreateInitialState, action) {
    switch (action.type) {
        case FETCH_CREATE_SUGGESTIONS_PENDING:
            return {
                ...state,
                pending: true
            };
        case FETCH_CREATE_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case FETCH_CREATE_SUGGESTIONS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function fetchUpdateSuggestions(state = fetchUpdateInitialState, action) {
    switch (action.type) {
        case FETCH_UPDATE_SUGGESTIONS_PENDING:
            return {
                ...state,
                pending: true
            };
        case FETCH_UPDATE_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case FETCH_UPDATE_SUGGESTIONS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function fetchBulkCreateSuggestions(state = fetchBulkCreateInitialState, action) {
    switch (action.type) {
        case FETCH_BULK_CREATE_SUGGESTIONS_PENDING:
            return {
                ...state,
                pending: true
            };
        case FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case FETCH_BULK_CREATE_SUGGESTIONS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}