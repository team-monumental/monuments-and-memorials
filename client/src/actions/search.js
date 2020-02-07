import { SEARCH_MONUMENTS_PENDING, SEARCH_MONUMENTS_ERROR, SEARCH_MONUMENTS_SUCCESS } from '../constants';
import * as QueryString from 'query-string';
import { addError } from './errors';
import get from '../utils/api-util';

function searchMonumentsPending() {
    return {
        type: SEARCH_MONUMENTS_PENDING
    };
}

function searchMonumentsSuccess(monuments) {
    return {
        type: SEARCH_MONUMENTS_SUCCESS,
        payload: monuments
    };
}

function searchMonumentsError(error) {
    return {
        type: SEARCH_MONUMENTS_ERROR,
        error: error
    };
}

/**
 * Searches for monuments and gets the total count of results
 */
export default function searchMonuments(options = {}) {
    return async dispatch => {
        const queryString = QueryString.stringify(options);
        dispatch(searchMonumentsPending());
        try {
            const count = await get(`/api/search/monuments/count/?${queryString}`);
            // We can skip the search query if the count has already come back as 0
            const monuments = count > 0 ? await get(`/api/search/monuments/?${queryString}`) : [];
            dispatch(searchMonumentsSuccess({
                count, monuments
            }));
        } catch (error) {
            dispatch(searchMonumentsError(error));
            dispatch(addError({
                message: error.message
            }));
        }
    }
}
