import { ADD_TOAST, REMOVE_TOAST, TOAST_FADE_IN, TOAST_FADE_OUT } from '../constants';

export default function toasts(state = [], action) {
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