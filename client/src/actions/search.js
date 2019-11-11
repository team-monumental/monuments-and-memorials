import { SEARCH_MONUMENTS_PENDING, SEARCH_MONUMENTS_ERROR, SEARCH_MONUMENTS_SUCCESS } from '../constants';
import * as QueryString from 'query-string';
import { addError } from './errors';
import { get } from '../util/api-util';

function searchMonumentsPending() {
    return {
        type: SEARCH_MONUMENTS_PENDING
    };
}

function searchMonumentsSuccess(monument) {
    return {
        type: SEARCH_MONUMENTS_SUCCESS,
        payload: monument
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
            const count = await get('/api/search/count/?', queryString);
            const monuments = await get('/api/search/?', queryString);
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
