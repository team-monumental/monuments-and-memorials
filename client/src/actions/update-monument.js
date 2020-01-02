import { FETCH_MONUMENT_UPDATE_PENDING, FETCH_MONUMENT_UPDATE_SUCCESS, FETCH_MONUMENT_UPDATE_ERROR } from '../constants';
import { addError } from './errors';
import { get } from '../utils/api-util';

function fetchMonumentForUpdatePending() {
    return {
        type: FETCH_MONUMENT_UPDATE_PENDING
    };
}

function fetchMonumentForUpdateSuccess(monument) {
    return {
        type: FETCH_MONUMENT_UPDATE_SUCCESS,
        payload: monument
    };
}

function fetchMonumentForUpdateError(error) {
    return {
        type: FETCH_MONUMENT_UPDATE_ERROR,
        error: error
    };
}

/**
 * Queries for a Monument and all related records to be displayed on the Update Monument Page
 */
export default function fetchMonumentForUpdate(id) {
    return async dispatch => {
        dispatch(fetchMonumentForUpdatePending());

        try {
            const monument = await get(`/api/monument/${id}?cascade=true`);
            dispatch(fetchMonumentForUpdateSuccess(monument));
        } catch(error) {
            dispatch(fetchMonumentForUpdateError(error));
            dispatch(addError({
                message: error.message
            }));
        }
    };
}