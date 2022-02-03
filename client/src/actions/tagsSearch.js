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
import * as QueryString from 'query-string';
import {get} from '../utils/api-util';
import {addError} from './errors';
import {error, pending, success} from '../utils/action-util';

const actions = {
    materials: {
        search: {
            pending: MATERIALS_SEARCH_PENDING,
            success: MATERIALS_SEARCH_SUCCESS,
            error: MATERIALS_SEARCH_ERROR,
            isMaterial: true
        },
        load: {
            pending: MATERIALS_LOAD_PENDING,
            success: MATERIALS_LOAD_SUCCESS,
            error: MATERIALS_LOAD_ERROR,
            isMaterial: true
        }
    },
    tags: {
        search: {
            pending: TAGS_SEARCH_PENDING,
            success: TAGS_SEARCH_SUCCESS,
            error: TAGS_SEARCH_ERROR,
            isMaterial: false
        },
        load: {
            pending: TAGS_LOAD_PENDING,
            success: TAGS_LOAD_SUCCESS,
            error: TAGS_LOAD_ERROR,
            isMaterial: false
        }
    }
};

export function searchTags(queryString) {
    return search(actions.tags.search, queryString);
}

export function searchMaterials(queryString) {
    return search(actions.materials.search, queryString);
}

function search(action, queryString) {
    return async dispatch => {
        dispatch(pending(action));
        try {
            const tags = await get(`/api/search/tags/?${
                QueryString.stringify({
                    q: queryString,
                    materials: action.isMaterial
                })
            }`);
            dispatch(success(action, {searchResults: tags}));
        } catch (err) {
            dispatch(error(action, err));
            dispatch(addError({
                message: err.message
            }));
        }
    }
}

export function clearTagSearchResults() {
    return clearSearchResults(actions.tags.search);
}

export function clearMaterialSearchResults() {
    return clearSearchResults(actions.materials.search);
}

function clearSearchResults(action) {
    return success(action, []);
}

export function loadTags(names) {
    return load(actions.tags.load, names);
}

export function loadMaterials(names) {
    return load(actions.materials.load, names);
}

function load(action, names) {
    return async dispatch => {
        dispatch(pending(action));
        try {
            const tags = await get(`/api/tags/?${QueryString.stringify({
                names: names,
                materials: action.isMaterial
            })}`, {arrayFormat: 'comma'});
            dispatch(success(action, {selectedTags: tags}));
        } catch (err) {
            dispatch(error(action, err));
            dispatch(addError({
                message: err.message
            }));
        }
    }
}