import {
    SEARCH_MONUMENTS_PENDING, SEARCH_MONUMENTS_ERROR, SEARCH_MONUMENTS_SUCCESS,
    SEARCH_USERS_PENDING, SEARCH_USERS_SUCCESS, SEARCH_USERS_ERROR,
    SEARCH_CREATE_SUGGESTIONS_PENDING, SEARCH_CREATE_SUGGESTIONS_SUCCESS, SEARCH_CREATE_SUGGESTIONS_ERROR,
    SEARCH_UPDATE_SUGGESTIONS_PENDING, SEARCH_UPDATE_SUGGESTIONS_SUCCESS, SEARCH_UPDATE_SUGGESTIONS_ERROR,
    SEARCH_BULK_CREATE_SUGGESTIONS_PENDING, SEARCH_BULK_CREATE_SUGGESTIONS_SUCCESS, SEARCH_BULK_CREATE_SUGGESTIONS_ERROR,
    GET_PENDING_SUGGESTION_COUNT_PENDING, GET_PENDING_SUGGESTION_COUNT_SUCCESS, GET_PENDING_SUGGESTION_COUNT_ERROR
} from '../constants';
import * as QueryString from 'query-string';
import { addError } from './errors';
import { get } from '../utils/api-util';
import { pending, success, error } from '../utils/action-util';

const actions = {
    monuments: {
        search: {
            pending: SEARCH_MONUMENTS_PENDING,
            success: SEARCH_MONUMENTS_SUCCESS,
            error: SEARCH_MONUMENTS_ERROR,
            uri: '/api/search/monuments'
        },
        count: {
            uri: '/api/search/monuments/count'
        }
    },
    users: {
        search: {
            pending: SEARCH_USERS_PENDING,
            success: SEARCH_USERS_SUCCESS,
            error: SEARCH_USERS_ERROR,
            uri: '/api/search/users'
        },
        count: {
            uri: '/api/search/users/count'
        }
    },
    suggestions: {
        create: {
            search: {
                pending: SEARCH_CREATE_SUGGESTIONS_PENDING,
                success: SEARCH_CREATE_SUGGESTIONS_SUCCESS,
                error: SEARCH_CREATE_SUGGESTIONS_ERROR,
                uri: '/api/search/suggestions/create'
            },
            count: {
                uri: '/api/search/suggestions/create/count'
            }
        },
        update: {
            search: {
                pending: SEARCH_UPDATE_SUGGESTIONS_PENDING,
                success: SEARCH_UPDATE_SUGGESTIONS_SUCCESS,
                error: SEARCH_UPDATE_SUGGESTIONS_ERROR,
                uri: '/api/search/suggestions/update'
            },
            count: {
                uri: '/api/search/suggestions/update/count'
            }
        },
        bulk: {
            search: {
                pending: SEARCH_BULK_CREATE_SUGGESTIONS_PENDING,
                success: SEARCH_BULK_CREATE_SUGGESTIONS_SUCCESS,
                error: SEARCH_BULK_CREATE_SUGGESTIONS_ERROR,
                uri: '/api/search/suggestions/bulk'
            },
            count: {
                uri: '/api/search/suggestions/bulk/count'
            }
        },
        pending: {
            pending: GET_PENDING_SUGGESTION_COUNT_PENDING,
            success: GET_PENDING_SUGGESTION_COUNT_SUCCESS,
            error: GET_PENDING_SUGGESTION_COUNT_ERROR,
            uri: '/api/search/suggestions/pending'
        }
    }
};

/**
 * Searches for monuments and gets the total count of results
 */
export function searchMonuments(options = {}) {
    options.cascade = true
    return search(options, actions.monuments, 'monuments');
}

export function searchUsers(options = {}) {
    return search(options, actions.users, 'users');
}

export function searchSuggestions(options = {}) {
    switch (options.type) {
        case 'create':
            return searchCreateSuggestions(options);
        case 'update':
            return searchUpdateSuggestions(options);
        case 'bulk':
            return searchBulkCreateSuggestions(options);
        default:
            return searchAllSuggestions(options);
    }
}

function searchCreateSuggestions(options = {}) {
    return search(options, actions.suggestions.create, 'createSuggestions');
}

function searchUpdateSuggestions(options = {}) {
    return search(options, actions.suggestions.update, 'updateSuggestions');
}

function searchBulkCreateSuggestions(options = {}) {
    return search(options, actions.suggestions.bulk, 'bulkCreateSuggestions');
}

function searchAllSuggestions(options = {}) {
    return dispatch => {
        dispatch(searchCreateSuggestions(options));
        dispatch(searchUpdateSuggestions(options));
        dispatch(searchBulkCreateSuggestions(options));
    };
}

function search(options, action, payloadName) {
    return async dispatch => {
        const queryString = QueryString.stringify(options);
        dispatch(pending(action.search));
        try {
            const count = await get(`${action.count.uri}/?${queryString}`);
            const payload = {count};
            // We can skip the search query if the count has already come back as 0
            payload[payloadName] = count > 0 ? await get(`${action.search.uri}/?${queryString}`) : [];
            dispatch(success(action.search, payload));
        } catch (err) {
            dispatch(error(action.search, err));
            dispatch(addError({
                message: err.message
            }));
        }
    };
}

export function countPendingSuggestions() {
    return async dispatch => {
        dispatch(pending(actions.suggestions.pending));

        try {
            const count = await get(actions.suggestions.pending.uri);
            dispatch(success(actions.suggestions.pending, {count}));
        } catch (err) {
            dispatch(error(actions.suggestions.pending, err));
        }
    };
}