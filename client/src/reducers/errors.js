import { ADD_ERROR, REMOVE_ERROR } from '../constants';

// Maintains a global error message queue
// This is used for high severity errors that should render the error on the page
export default function errors(state = [], action) {
    const { payload, type } = action;
    switch (type) {
        case ADD_ERROR:
            return [payload, ...state];
        case REMOVE_ERROR:
            return state.filter(error => error.id !== payload);
        default:
            return state;
    }
}