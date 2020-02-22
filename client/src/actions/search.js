import { SEARCH_MONUMENTS_PENDING, SEARCH_MONUMENTS_ERROR, SEARCH_MONUMENTS_SUCCESS } from '../constants';
import * as QueryString from 'query-string';
import { addError } from './errors';
import { get } from '../utils/api-util';
import { pending, success, error } from '../utils/action-util';

const actions = {
    search: {
        pending: SEARCH_MONUMENTS_PENDING,
        success: SEARCH_MONUMENTS_SUCCESS,
        error: SEARCH_MONUMENTS_ERROR,
        uri: '/api/search/monuments'
    },
    count: {
        uri: '/api/search/monuments/count'
    }
};

/**
 * Searches for monuments and gets the total count of results
 */
export default function searchMonuments(options = {}) {
    return async dispatch => {
        const queryString = QueryString.stringify(options);
        dispatch(pending(actions.search));
        try {
            const count = await get(`${actions.count.uri}/?${queryString}`);
            // We can skip the search query if the count has already come back as 0
            const monuments = count > 0 ? await get(`${actions.search.uri}/?${queryString}`) : [];
            dispatch(success(actions.search, {
                count, monuments
            }));
        } catch (err) {
            dispatch(error(actions.search, err));
            dispatch(addError({
                message: err.message
            }));
        }
    }
}
