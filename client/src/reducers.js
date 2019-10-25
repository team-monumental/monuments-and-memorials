import { ADD_TOAST, ADD_ERROR, REMOVE_TOAST, TOAST_FADE_IN, TOAST_FADE_OUT, REMOVE_ERROR, ERROR_LOGGED } from './constants';

const Reducers = {

    // Maintains a global error message queue
    errors(state = [], action) {
        const { payload, type } = action;
        switch (type) {
            case ADD_ERROR:
                return [payload, ...state];
            case ERROR_LOGGED:
                return state.map(error => {
                    if (error.id === payload) error.logged = true;
                    return error;
                });
            case REMOVE_ERROR:
                return state.filter(error => error.id !== payload);
            default:
                return state;
        }
    },

    toasts(state = [], action) {
        const { payload, type } = action;
        switch (type) {
            case ADD_TOAST:
                payload.hide = true;
                return [payload, ...state];
            case TOAST_FADE_IN:
                return state.map(toast => {
                    if (toast.id === payload) toast.hide = false;
                    return toast;
                });
            case TOAST_FADE_OUT:
                return state.map(toast => {
                    if (toast.id === payload) toast.hide = true;
                    return toast;
                });
            case REMOVE_TOAST:
                return state.filter(toast => toast.id !== payload);
            default:
                return state;
        }
    }
};

export default Reducers;