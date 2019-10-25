import { createError, createToast } from './factories';
import { ADD_TOAST, REMOVE_TOAST, TOAST_FADE_IN, TOAST_FADE_OUT, ADD_ERROR, REMOVE_ERROR, ERROR_LOGGED } from './constants';

export function addToast(options = {}) {
    return (dispatch) => {
        const toast = createToast(options);
        dispatch({
            payload: toast,
            type: ADD_TOAST
        });
        setTimeout(() => {
            dispatch({
                payload: toast.id,
                type: TOAST_FADE_IN
            })
        }, 1);
        setTimeout(() => {
            dispatch({
                payload: toast.id,
                type: TOAST_FADE_OUT
            });
            setTimeout(() => removeToast(toast.id), 150);
        }, toast.duration);
    };
}

export function removeToast(id) {
    return {
        payload: id,
        type: REMOVE_TOAST
    };
}

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

export function errorLogged(id) {
    return {
        payload: id,
        type: ERROR_LOGGED
    };
}
