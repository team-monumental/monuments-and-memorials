import { createError } from '../factories';
import { ADD_ERROR, REMOVE_ERROR } from '../constants';

export function addError(options = {}) {
    const error = createError(options);
    return {
        payload: error,
        type: ADD_ERROR
    };
}

export function removeError(id) {
    return {
        payload: id,
        type: REMOVE_ERROR
    };
}