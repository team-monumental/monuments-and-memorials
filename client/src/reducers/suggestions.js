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

const fetchSuggestionsInitialState = {
    pending: false,
    result: null,
    error: null
};

const fetchSuggestionInitialState = {
    pending: false,
    result: null,
    error: null
};

const approveInitialState = {
    pending: false,
    result: null,
    error: null
};

const rejectInitialState = {
    pending: false,
    result: null,
    error: null
};

export function fetchCreateSuggestions(state = fetchSuggestionsInitialState, action) {
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

export function fetchUpdateSuggestions(state = fetchSuggestionsInitialState, action) {
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

export function fetchBulkCreateSuggestions(state = fetchSuggestionsInitialState, action) {
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

export function fetchCreateSuggestion(state = fetchSuggestionInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return fetchSuggestionInitialState;
        case FETCH_CREATE_SUGGESTION_PENDING:
            return {
                ...state,
                pending: true
            };
        case FETCH_CREATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case FETCH_CREATE_SUGGESTION_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function fetchUpdateSuggestion(state = fetchSuggestionInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return fetchSuggestionInitialState;
        case FETCH_UPDATE_SUGGESTION_PENDING:
            return {
                ...state,
                pending: true
            };
        case FETCH_UPDATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case FETCH_UPDATE_SUGGESTION_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function fetchBulkCreateSuggestion(state = fetchSuggestionInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return fetchSuggestionInitialState;
        case FETCH_BULK_CREATE_SUGGESTION_PENDING:
            return {
                ...state,
                pending: true
            };
        case FETCH_BULK_CREATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case FETCH_BULK_CREATE_SUGGESTION_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function approveCreateSuggestion(state = approveInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return approveInitialState;
        case APPROVE_CREATE_SUGGESTION_PENDING:
            return {
                ...state,
                pending: true
            };
        case APPROVE_CREATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case APPROVE_CREATE_SUGGESTION_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function rejectCreateSuggestion(state = rejectInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return rejectInitialState;
        case REJECT_CREATE_SUGGESTION_PENDING:
            return {
                ...state,
                pending: true
            };
        case REJECT_CREATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case REJECT_CREATE_SUGGESTION_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function approveUpdateSuggestion(state = approveInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return approveInitialState;
        case APPROVE_UPDATE_SUGGESTION_PENDING:
            return {
                ...state,
                pending: true
            };
        case APPROVE_UPDATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case APPROVE_UPDATE_SUGGESTION_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function rejectUpdateSuggestion(state = rejectInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return rejectInitialState;
        case REJECT_UPDATE_SUGGESTION_PENDING:
            return {
                ...state,
                pending: true
            };
        case REJECT_UPDATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case REJECT_UPDATE_SUGGESTION_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function approveBulkCreateSuggestion(state = approveInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return approveInitialState;
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

export function rejectBulkCreateSuggestion(state = rejectInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return rejectInitialState;
        case REJECT_BULK_CREATE_SUGGESTION_PENDING:
            return {
                ...state,
                pending: true
            };
        case REJECT_BULK_CREATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                pending: false,
                result: action.payload
            };
        case REJECT_BULK_CREATE_SUGGESTION_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}