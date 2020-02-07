import {
    TAGS_SEARCH_PENDING, TAGS_SEARCH_ERROR, TAGS_SEARCH_SUCCESS,
    TAGS_LOAD_ERROR, TAGS_LOAD_SUCCESS, TAGS_LOAD_PENDING,
    MATERIALS_SEARCH_PENDING, MATERIALS_SEARCH_SUCCESS, MATERIALS_LOAD_PENDING,
    MATERIALS_LOAD_SUCCESS, MATERIALS_LOAD_ERROR, MATERIALS_SEARCH_ERROR
} from '../constants';
import * as QueryString from 'query-string';
import get from '../utils/api-util';
import { addError } from './errors';

function searchPending(isMaterial) {
    return {
        type: isMaterial ? MATERIALS_SEARCH_PENDING : TAGS_SEARCH_PENDING
    };
}

function searchSuccess(isMaterial, searchResults) {
    return {
        type: isMaterial ? MATERIALS_SEARCH_SUCCESS : TAGS_SEARCH_SUCCESS,
        payload: {searchResults}
    };
}

function searchError(isMaterial, error) {
    return {
        type: isMaterial ? MATERIALS_SEARCH_ERROR : TAGS_SEARCH_ERROR,
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
        type: isMaterial ? MATERIALS_LOAD_PENDING : TAGS_LOAD_PENDING
    };
}

function loadSuccess(isMaterial, selectedTags) {
    return {
        type: isMaterial ? MATERIALS_LOAD_SUCCESS : TAGS_LOAD_SUCCESS,
        payload: {selectedTags}
    };
}

function loadError(isMaterial, error) {
    return {
        type: isMaterial ? MATERIALS_LOAD_ERROR : TAGS_LOAD_ERROR,
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