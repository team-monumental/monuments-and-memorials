import { FETCH_MAP_MONUMENTS_PENDING, FETCH_MAP_MONUMENTS_SUCCESS, FETCH_MAP_MONUMENTS_ERROR } from '../constants';
import { get } from '../utils/api-util';
import { addError } from './errors';
import { success, pending, error } from '../utils/action-util';

const actions = {
    fetchMonuments: {
        pending: FETCH_MAP_MONUMENTS_PENDING,
        success: FETCH_MAP_MONUMENTS_SUCCESS,
        error: FETCH_MAP_MONUMENTS_ERROR,
        uri: '/api/monuments'
    }
};

/**
 * Queries for all monuments, to be displayed on the monument map page
 * This is an async action (redux-thunk)
 */
export default function fetchMonuments() {
    return async dispatch => {
        dispatch(pending(actions.fetchMonuments));
        try {
            const monuments = await get(actions.fetchMonuments.uri);
            dispatch(success(actions.fetchMonuments,{monuments}));
        } catch (err) {
            dispatch(error(actions.fetchMonuments, err));
            dispatch(addError({
                message: err.message
            }));
        }
    }
}
