import {
    FETCH_MONUMENT_UPDATE_PENDING, FETCH_MONUMENT_UPDATE_SUCCESS, FETCH_MONUMENT_UPDATE_ERROR, UPDATE_MONUMENT_PENDING,
    UPDATE_MONUMENT_SUCCESS, UPDATE_MONUMENT_ERROR
} from '../constants';
import { addError } from './errors';
import { get, put } from '../utils/api-util';

const actions = {
    fetch: 'fetch',
    update: 'update'
};

function pending(action) {
    return {
        type: action === actions.fetch ? FETCH_MONUMENT_UPDATE_PENDING : UPDATE_MONUMENT_PENDING
    };
}

function success(action, result) {
    return {
        type: action === actions.fetch ? FETCH_MONUMENT_UPDATE_SUCCESS : UPDATE_MONUMENT_SUCCESS,
        payload: result
    };
}

function error(action, error) {
    return {
        type: action === actions.fetch ? FETCH_MONUMENT_UPDATE_ERROR : UPDATE_MONUMENT_ERROR,
        error: error
    };
}

/**
 * Queries for a Monument and all related records to be displayed on the Update Monument Page
 */
export default function fetchMonumentForUpdate(id) {
    const fetch = 'fetch';

    return async dispatch => {
        dispatch(pending(fetch));

        try {
            const monument = await get(`/api/monument/${id}?cascade=true`);
            dispatch(success(fetch, monument));
        } catch(err) {
            dispatch(error(fetch, err));
            dispatch(addError({
                message: err.message
            }));
        }
    };
}

/**
 * Send a request to the server to update the Monument with the specified ID to have the attributes contained
 * in newMonument
 */
export function updateMonument(id, newMonument) {
    const update = 'update';

    return async dispatch => {
        dispatch(pending(update));

        try {
            const updatedMonument = await put(`/api/monument/${id}`, newMonument);
            dispatch(success(update, updatedMonument));
        } catch (err) {
            dispatch(error(update, err));
            dispatch(addError({
                message: err.message
            }));
        }
    };
}