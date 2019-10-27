import { createError } from '../factories';
import { ADD_ERROR, REMOVE_ERROR } from '../constants';

/**
 * Adds an error to the error queue, to be displayed on the page
 */
export function addError(options = {}) {
    const error = createError(options);
    return {
        payload: error,
        type: ADD_ERROR
    };
}

/**
 * Removes an error from the queue
 */
export function removeError(id) {
    return {
        payload: id,
        type: REMOVE_ERROR
    };
}