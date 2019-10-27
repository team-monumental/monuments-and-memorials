import { createToast } from '../factories';
import { ADD_TOAST, REMOVE_TOAST, TOAST_FADE_IN, TOAST_FADE_OUT } from '../constants';

/**
 * Adds a toast to the queue, to be displayed for a set time
 */
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

/**
 * Removes a toast from the queue
 */
export function removeToast(id) {
    return {
        payload: id,
        type: REMOVE_TOAST
    };
}