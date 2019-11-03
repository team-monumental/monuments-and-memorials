import { FETCH_MAP_MONUMENTS_PENDING, FETCH_MAP_MONUMENTS_SUCCESS, FETCH_MAP_MONUMENTS_ERROR } from '../constants';

function fetchMonumentsPending() {
    return {
        type: FETCH_MAP_MONUMENTS_PENDING
    };
}

function fetchMonumentsSuccess(monuments) {
    return {
        type: FETCH_MAP_MONUMENTS_SUCCESS,
        payload: monuments
    };
}

function fetchMonumentsError(error) {
    return {
        type: FETCH_MAP_MONUMENTS_ERROR,
        error: error
    };
}

/**
 * Queries for all monuments, to be displayed on the monument map page
 * This is an async action (redux-thunk)
 */
export default function fetchMonuments() {
    return async dispatch => {
        dispatch(fetchMonumentsPending());
        let error = null;
        const res = await fetch(`/api/monuments`)
            .then(res => res.json())
            .catch(err => error = err);

        if (error || res.error) dispatch(fetchMonumentsError(error || res.error));
        else dispatch(fetchMonumentsSuccess(res));
    }
}
