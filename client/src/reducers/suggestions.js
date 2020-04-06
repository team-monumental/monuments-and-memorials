import {
    FETCH_CREATE_SUGGESTIONS_PENDING, FETCH_CREATE_SUGGESTIONS_SUCCESS, FETCH_CREATE_SUGGESTIONS_ERROR,
    FETCH_UPDATE_SUGGESTIONS_PENDING, FETCH_UPDATE_SUGGESTIONS_SUCCESS, FETCH_UPDATE_SUGGESTIONS_ERROR,
    FETCH_BULK_CREATE_SUGGESTIONS_PENDING, FETCH_BULK_CREATE_SUGGESTIONS_SUCCESS, FETCH_BULK_CREATE_SUGGESTIONS_ERROR,
    FETCH_CREATE_SUGGESTION_PENDING, FETCH_CREATE_SUGGESTION_SUCCESS, FETCH_CREATE_SUGGESTION_ERROR,
    FETCH_UPDATE_SUGGESTION_PENDING, FETCH_UPDATE_SUGGESTION_SUCCESS, FETCH_UPDATE_SUGGESTION_ERROR,
    FETCH_BULK_CREATE_SUGGESTION_PENDING, FETCH_BULK_CREATE_SUGGESTION_SUCCESS, FETCH_BULK_CREATE_SUGGESTION_ERROR,
    APPROVE_CREATE_SUGGESTION_PENDING, APPROVE_CREATE_SUGGESTION_SUCCESS, APPROVE_CREATE_SUGGESTION_ERROR,
    REJECT_CREATE_SUGGESTION_PENDING, REJECT_CREATE_SUGGESTION_SUCCESS, REJECT_CREATE_SUGGESTION_ERROR
} from '../constants';

const fetchCreatesInitialState = {
    pending: false,
    result: null,
    error: null
};

const fetchUpdatesInitialState = {
    pending: false,
    result: null,
    error: null
};

const fetchBulkCreatesInitialState = {
    pending: false,
    result: null,
    error: null
};

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

const approveCreateInitialState = {
    pending: false,
    result: null,
    error: null
};

const rejectCreateInitialState = {
    pending: false,
    result: null,
    error: null
};

export function fetchCreateSuggestions(state = fetchCreatesInitialState, action) {
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

export function fetchUpdateSuggestions(state = fetchUpdatesInitialState, action) {
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

export function fetchBulkCreateSuggestions(state = fetchBulkCreatesInitialState, action) {
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

export function fetchCreateSuggestion(state = fetchCreateInitialState, action) {
    switch (action.type) {
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

export function fetchUpdateSuggestion(state = fetchUpdateInitialState, action) {
    switch (action.type) {
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

export function fetchBulkCreateSuggestion(state = fetchBulkCreateInitialState, action) {
    switch (action.type) {
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

export function approveCreateSuggestion(state = approveCreateInitialState, action) {
    switch (action.type) {
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

export function rejectCreateSuggestion(state = rejectCreateInitialState, action) {
    switch (action.type) {
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