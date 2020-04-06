import {
    SEARCH_MONUMENTS_PENDING,
    SEARCH_MONUMENTS_SUCCESS,
    SEARCH_MONUMENTS_ERROR,
    SEARCH_USERS_PENDING,
    SEARCH_USERS_SUCCESS,
    SEARCH_USERS_ERROR,
    SEARCH_CREATE_SUGGESTIONS_PENDING,
    SEARCH_CREATE_SUGGESTIONS_SUCCESS,
    SEARCH_CREATE_SUGGESTIONS_ERROR,
    SEARCH_UPDATE_SUGGESTIONS_PENDING,
    SEARCH_UPDATE_SUGGESTIONS_SUCCESS,
    SEARCH_UPDATE_SUGGESTIONS_ERROR,
    SEARCH_BULK_CREATE_SUGGESTIONS_PENDING,
    SEARCH_BULK_CREATE_SUGGESTIONS_SUCCESS,
    SEARCH_BULK_CREATE_SUGGESTIONS_ERROR,
    GET_PENDING_SUGGESTION_COUNT_PENDING, GET_PENDING_SUGGESTION_COUNT_SUCCESS, GET_PENDING_SUGGESTION_COUNT_ERROR
} from '../constants';
import basicReducer from '../utils/basic-reducer';

const initialState = {
    pending: false,
    monuments: [],
    count: 0,
    error: null
};

// Tracks the progress of getting search results and total result count on the search page
export function searchPage(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: SEARCH_MONUMENTS_PENDING,
        success: SEARCH_MONUMENTS_SUCCESS,
        error: SEARCH_MONUMENTS_ERROR
    });
}

const userInitialState = {
    pending: false,
    users: [],
    count: 0,
    error: null
};

export function userSearchPage(state = userInitialState, action) {
    return basicReducer(state, userInitialState, action, {
        pending: SEARCH_USERS_PENDING,
        success: SEARCH_USERS_SUCCESS,
        error: SEARCH_USERS_ERROR
    }, false);
}

const createSuggestionInitialState = {
    pending: false,
    createSuggestions: [],
    count: 0,
    error: null
};

export function createSuggestionSearchPage(state = createSuggestionInitialState, action) {
    return basicReducer(state, action, {
        pending: SEARCH_CREATE_SUGGESTIONS_PENDING,
        success: SEARCH_CREATE_SUGGESTIONS_SUCCESS,
        error: SEARCH_CREATE_SUGGESTIONS_ERROR
    });
}

const updateSuggestionInitialState = {
    pending: false,
    updateSuggestions: [],
    count: 0,
    error: null
};

export function updateSuggestionSearchPage(state = updateSuggestionInitialState, action) {
    return basicReducer(state, action, {
        pending: SEARCH_UPDATE_SUGGESTIONS_PENDING,
        success: SEARCH_UPDATE_SUGGESTIONS_SUCCESS,
        error: SEARCH_UPDATE_SUGGESTIONS_ERROR
    });
}

const bulkCreateSuggestionInitialState = {
    pending: false,
    bulkCreateSuggestions: [],
    count: 0,
    error: null
};

export function bulkCreateSuggestionSearchPage(state = bulkCreateSuggestionInitialState, action) {
    return basicReducer(state, action, {
        pending: SEARCH_BULK_CREATE_SUGGESTIONS_PENDING,
        success: SEARCH_BULK_CREATE_SUGGESTIONS_SUCCESS,
        error: SEARCH_BULK_CREATE_SUGGESTIONS_ERROR
    });
}

const pendingSuggestionsInitialState = {
    pending: false,
    count: 0,
    error: null
};

export function pendingSuggestions(state = pendingSuggestionsInitialState, action) {
    return basicReducer(state, action, {
        pending: GET_PENDING_SUGGESTION_COUNT_PENDING,
        success: GET_PENDING_SUGGESTION_COUNT_SUCCESS,
        error: GET_PENDING_SUGGESTION_COUNT_ERROR
    });
}