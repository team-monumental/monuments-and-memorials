import { FETCH_MAP_MONUMENTS_PENDING, FETCH_MAP_MONUMENTS_SUCCESS, FETCH_MAP_MONUMENTS_ERROR } from '../constants';
import get from '../utils/get';
import { addError } from './errors';

function fetchMonumentsPending() {
    return {
        type: FETCH_MAP_MONUMENTS_PENDING
    };
}

function fetchMonumentsSuccess(monuments) {
    return {
        type: FETCH_MAP_MONUMENTS_SUCCESS,
        payload: {monuments}
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
        try {
            const monuments = await get(`/api/monuments`);
            dispatch(fetchMonumentsSuccess(monuments));
        } catch (error) {
            dispatch(fetchMonumentsError(error));
            dispatch(addError({
                message: error.message
            }));
        }
    }
}
