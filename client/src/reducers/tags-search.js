import {
    MATERIALS_LOAD_ERROR,
    MATERIALS_LOAD_PENDING,
    MATERIALS_LOAD_SUCCESS,
    MATERIALS_SEARCH_ERROR,
    MATERIALS_SEARCH_PENDING,
    MATERIALS_SEARCH_SUCCESS,
    TAGS_LOAD_ERROR,
    TAGS_LOAD_PENDING,
    TAGS_LOAD_SUCCESS,
    TAGS_SEARCH_ERROR,
    TAGS_SEARCH_PENDING,
    TAGS_SEARCH_SUCCESS
} from '../constants';
import basicReducer from './basic';

const searchInitialState = {
    pending: false,
    searchResults: [],
    error: null
};

// Tracks the progress of searching for tags by name for the tags search on the monument search page
export function tagsSearch(state = searchInitialState, action) {
    return basicReducer(state, searchInitialState, action, {
        pending: TAGS_SEARCH_PENDING,
        success: TAGS_SEARCH_SUCCESS,
        error: TAGS_SEARCH_ERROR
    });
}

export function materialsSearch(state = searchInitialState, action) {
    return basicReducer(state, searchInitialState, action, {
        pending: MATERIALS_SEARCH_PENDING,
        success: MATERIALS_SEARCH_SUCCESS,
        error: MATERIALS_SEARCH_ERROR
    });
}

const loadInitialState = {
    pending: false,
    selectedTags: [],
    error: null
};

// Tracks the progress of loading in the selected tags on page load for the tags search on the monument search page
export function tagsLoad(state = loadInitialState, action) {
    return basicReducer(state, loadInitialState, action, {
        pending: TAGS_LOAD_PENDING,
        success: TAGS_LOAD_SUCCESS,
        error: TAGS_LOAD_ERROR
    });
}

export function materialsLoad(state = loadInitialState, action) {
    return basicReducer(state, loadInitialState, action, {
        pending: MATERIALS_LOAD_PENDING,
        success: MATERIALS_LOAD_SUCCESS,
        error: MATERIALS_LOAD_ERROR
    });
}