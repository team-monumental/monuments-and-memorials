import {
    FETCH_MONUMENT_UPDATE_PENDING, FETCH_MONUMENT_UPDATE_SUCCESS, FETCH_MONUMENT_UPDATE_ERROR, UPDATE_SUGGESTION_PENDING,
    UPDATE_SUGGESTION_SUCCESS, UPDATE_SUGGESTION_ERROR, TOGGLE_MONUMENT_IS_ACTIVE_PENDING, TOGGLE_MONUMENT_IS_ACTIVE_SUCCESS,
    TOGGLE_MONUMENT_IS_ACTIVE_ERROR, DELETE_MONUMENT_PENDING, DELETE_MONUMENT_SUCCESS, DELETE_MONUMENT_ERROR
} from '../constants';
import { addError } from './errors';
import { get, post, put, del } from '../utils/api-util';
import { pending, success, error } from '../utils/action-util';

const actions = {
    fetch: {
        pending: FETCH_MONUMENT_UPDATE_PENDING,
        success: FETCH_MONUMENT_UPDATE_SUCCESS,
        error: FETCH_MONUMENT_UPDATE_ERROR
    },
    update: {
        pending: UPDATE_SUGGESTION_PENDING,
        success: UPDATE_SUGGESTION_SUCCESS,
        error: UPDATE_SUGGESTION_ERROR
    },
    toggleActive: {
        pending: TOGGLE_MONUMENT_IS_ACTIVE_PENDING,
        success: TOGGLE_MONUMENT_IS_ACTIVE_SUCCESS,
        error: TOGGLE_MONUMENT_IS_ACTIVE_ERROR
    },
    delete: {
        pending: DELETE_MONUMENT_PENDING,
        success: DELETE_MONUMENT_SUCCESS,
        error: DELETE_MONUMENT_ERROR
    }
};

/**
 * Queries for a Monument and all related records to be displayed on the Update Monument Page
 */
export default function fetchMonumentForUpdate(id) {
    return async dispatch => {
        dispatch(pending(actions.fetch));

        try {
            const monument = await get(`/api/monument/${id}?cascade=true`);
            dispatch(success(actions.fetch, monument));
        } catch(err) {
            dispatch(error(actions.fetch, err));
            dispatch(addError({
                message: err.message
            }));
        }
    };
}

/**
 * Send a request to the server to create an UpdateMonumentSuggestion for the Monument with the specified ID to have
 * the attributes contained in suggestion
 */
export function updateSuggestion(id, suggestion) {
    return async dispatch => {
        dispatch(pending(actions.update));

        try {
            const updateSuggestion = await post(`/api/suggestion/update/${id}`, suggestion);
            dispatch(success(actions.update, updateSuggestion));
        } catch (err) {
            dispatch(error(actions.update, err));
            dispatch(addError({
                message: err.message
            }));
        }
    };
}

export function toggleMonumentIsActive(id, isActive) {
    return async dispatch => {
        dispatch(pending(actions.toggleActive));
        try {
            const updatedMonument = await put(`/api/monument/active/${id}`, {isActive});
            dispatch(success(actions.toggleActive, {payload: updatedMonument}));
        } catch (err) {
            dispatch(error(actions.toggleActive, err));
        }
    }
}

export function deleteMonument(id) {
    return async dispatch => {
        dispatch(pending(actions.delete));
        try {
            const result = await del(`/api/monument/${id}`);
            if (result.success) {
                dispatch(success(actions.delete, {success: true}));
            } else {
                dispatch(error(actions.delete));
            }
        } catch (err) {
            dispatch(error(actions.delete, err));
        }
    }
}