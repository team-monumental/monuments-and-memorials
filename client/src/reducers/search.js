import {
    SEARCH_MONUMENTS_PENDING,
    SEARCH_MONUMENTS_SUCCESS,
    SEARCH_MONUMENTS_ERROR,
    SEARCH_USERS_PENDING, SEARCH_USERS_SUCCESS, SEARCH_USERS_ERROR
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