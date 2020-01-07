import {
    FETCH_MONUMENT_UPDATE_PENDING, FETCH_MONUMENT_UPDATE_SUCCESS, FETCH_MONUMENT_UPDATE_ERROR, UPDATE_MONUMENT_PENDING,
    UPDATE_MONUMENT_SUCCESS, UPDATE_MONUMENT_ERROR
} from '../constants';
import { addError } from './errors';
import { get, put } from '../utils/api-util';

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

function updateMonumentPending() {
    return {
        type: UPDATE_MONUMENT_PENDING
    };
}

function updateMonumentSuccess(updatedMonument) {
    return {
        type: UPDATE_MONUMENT_SUCCESS,
        payload: updatedMonument
    };
}

function updateMonumentError(error) {
    return {
        type: UPDATE_MONUMENT_ERROR,
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

/**
 * Send a request to the server to update the Monument with the specified ID to have the attributes contained
 * in newMonument
 */
export function updateMonument(id, newMonument) {
    return async dispatch => {
        dispatch(updateMonumentPending());

        try {
            const updatedMonument = await put(`/api/monument/${id}`, newMonument);
            dispatch(updateMonumentSuccess(updatedMonument));
        } catch (error) {
            dispatch(updateMonumentError(error));
            dispatch(addError({
                message: error.message
            }));
        }
    };
}