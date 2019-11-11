import { FILTER_TAGS_SEARCH_PENDING, FILTER_TAGS_SEARCH_ERROR, FILTER_TAGS_SEARCH_SUCCESS, FILTER_TAGS_LOAD_ERROR, FILTER_TAGS_LOAD_SUCCESS, FILTER_TAGS_LOAD_PENDING } from '../constants';
import * as QueryString from 'query-string';
import get from '../utils/get';
import { addError } from './errors';

function searchTagsPending() {
    return {
        type: FILTER_TAGS_SEARCH_PENDING
    };
}

function searchTagsSuccess(searchResults) {
    return {
        type: FILTER_TAGS_SEARCH_SUCCESS,
        payload: {searchResults}
    };
}

function searchTagsError(error) {
    return {
        type: FILTER_TAGS_SEARCH_ERROR,
        error: error
    };
}

/**
 * Searches for monuments and gets the total count of results
 */
export function searchTags(queryString) {
    return async dispatch => {
        dispatch(searchTagsPending());
        try {
            const tags = await get(`/api/search/tags/?q=${queryString}`);
            dispatch(searchTagsSuccess(tags));
        } catch (error) {
            dispatch(searchTagsError(error));
            dispatch(addError({
                message: error.message
            }));
        }
    }
}

export function clearTagSearchResults() {
    return searchTagsSuccess([]);
}

function loadTagsPending() {
    return {
        type: FILTER_TAGS_LOAD_PENDING
    };
}

function loadTagsSuccess(selectedTags) {
    return {
        type: FILTER_TAGS_LOAD_SUCCESS,
        payload: {selectedTags}
    };
}

function loadTagsError(error) {
    return {
        type: FILTER_TAGS_LOAD_ERROR,
        error: error
    };
}

/**
 * Searches for monuments and gets the total count of results
 */
export function loadTags(names) {
    return async dispatch => {
        dispatch(loadTagsPending());
        try {
            const tags = await get(`/api/tags/?${QueryString.stringify({
                names: names
            })}`, {arrayFormat: 'comma'});
            dispatch(loadTagsSuccess(tags));
        } catch (error) {
            dispatch(loadTagsError(error));
            dispatch(addError({
                message: error.message
            }));
        }
    }
}