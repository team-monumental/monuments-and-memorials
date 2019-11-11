import {
    FILTER_TAGS_SEARCH_PENDING, FILTER_TAGS_SEARCH_ERROR, FILTER_TAGS_SEARCH_SUCCESS,
    FILTER_TAGS_LOAD_ERROR, FILTER_TAGS_LOAD_SUCCESS, FILTER_TAGS_LOAD_PENDING,
    FILTER_MATERIALS_SEARCH_PENDING, FILTER_MATERIALS_SEARCH_SUCCESS, FILTER_MATERIALS_LOAD_PENDING,
    FILTER_MATERIALS_LOAD_SUCCESS, FILTER_MATERIALS_LOAD_ERROR, FILTER_MATERIALS_SEARCH_ERROR
} from '../constants';
import * as QueryString from 'query-string';
import get from '../utils/get';
import { addError } from './errors';

function searchPending(isMaterial) {
    return {
        type: isMaterial ? FILTER_MATERIALS_SEARCH_PENDING : FILTER_TAGS_SEARCH_PENDING
    };
}

function searchSuccess(isMaterial, searchResults) {
    return {
        type: isMaterial ? FILTER_MATERIALS_SEARCH_SUCCESS : FILTER_TAGS_SEARCH_SUCCESS,
        payload: {searchResults}
    };
}

function searchError(isMaterial, error) {
    return {
        type: isMaterial ? FILTER_MATERIALS_SEARCH_ERROR : FILTER_TAGS_SEARCH_ERROR,
        error: error
    };
}

export function searchTags(queryString) {
    return search(false, queryString);
}

export function searchMaterials(queryString) {
    return search(true, queryString);
}

function search(isMaterial, queryString) {
    return async dispatch => {
        dispatch(searchPending(isMaterial));
        try {
            const tags = await get(`/api/search/tags/?${
                QueryString.stringify({
                    q: queryString,
                    materials: isMaterial
                })
            }`);
            dispatch(searchSuccess(isMaterial, tags));
        } catch (error) {
            dispatch(searchError(isMaterial, error));
            dispatch(addError({
                message: error.message
            }));
        }
    }
}

export function clearTagSearchResults() {
    return clearSearchResults(false);
}

export function clearMaterialSearchResults() {
    return clearSearchResults(true);
}

function clearSearchResults(isMaterial) {
    return searchSuccess(isMaterial, []);
}

function loadPending(isMaterial) {
    return {
        type: isMaterial ? FILTER_MATERIALS_LOAD_PENDING : FILTER_TAGS_LOAD_PENDING
    };
}

function loadSuccess(isMaterial, selectedTags) {
    return {
        type: isMaterial ? FILTER_MATERIALS_LOAD_SUCCESS : FILTER_TAGS_LOAD_SUCCESS,
        payload: {selectedTags}
    };
}

function loadError(isMaterial, error) {
    return {
        type: isMaterial ? FILTER_MATERIALS_LOAD_ERROR : FILTER_TAGS_LOAD_ERROR,
        error: error
    };
}

export function loadTags(names) {
    return load(false, names);
}

export function loadMaterials(names) {
    return load(true, names);
}

function load(isMaterial, names) {
    return async dispatch => {
        dispatch(loadPending(isMaterial));
        try {
            const tags = await get(`/api/tags/?${QueryString.stringify({
                names: names,
                materials: isMaterial
            })}`, {arrayFormat: 'comma'});
            dispatch(loadSuccess(isMaterial, tags));
        } catch (error) {
            dispatch(loadError(isMaterial, error));
            dispatch(addError({
                message: error.message
            }));
        }
    }
}