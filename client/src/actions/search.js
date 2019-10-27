import { SEARCH_MONUMENTS_PENDING, SEARCH_MONUMENTS_ERROR, SEARCH_MONUMENTS_SUCCESS } from '../constants';
import * as QueryString from 'query-string';

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

async function get(url, queryString) {
    let error = null;
    let res = await fetch(url + queryString)
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
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
        }
    }
}
