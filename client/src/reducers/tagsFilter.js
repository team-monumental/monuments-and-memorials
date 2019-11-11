import { FILTER_TAGS_SEARCH_ERROR, FILTER_TAGS_SEARCH_PENDING, FILTER_TAGS_SEARCH_SUCCESS, FILTER_TAGS_LOAD_PENDING, FILTER_TAGS_LOAD_ERROR, FILTER_TAGS_LOAD_SUCCESS } from '../constants';
import basicReducer from '../utils/basicReducer';

const searchInitialState = {
    pending: false,
    searchResults: [],
    error: null
};

// Tracks the progress of searching for tags by name for the tags filter on the monument search page
export function tagsFilterSearch(state = searchInitialState, action) {
    return basicReducer(state, action, {
        pending: FILTER_TAGS_SEARCH_PENDING,
        success: FILTER_TAGS_SEARCH_SUCCESS,
        error: FILTER_TAGS_SEARCH_ERROR
    });
}

const filterInitialState = {
    pending: false,
    selectedTags: [],
    error: null
};

// Tracks the progress of loading in the selected tags on page load for the tags filter on the monument search page
export function tagsFilterLoad(state = filterInitialState, action) {
    return basicReducer(state, action, {
        pending: FILTER_TAGS_LOAD_PENDING,
        success: FILTER_TAGS_LOAD_SUCCESS,
        error: FILTER_TAGS_LOAD_ERROR
    });
}