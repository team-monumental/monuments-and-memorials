import { ADD_ERROR, REMOVE_ERROR } from '../constants';
import { LOCATION_CHANGE } from 'connected-react-router';

// Maintains a global error message queue
// This is used for high severity errors that should render the error on the page
export default function errors(state = [], action) {
    const { payload, type } = action;
    switch (type) {
        case LOCATION_CHANGE:
            return [];
        case ADD_ERROR:
            return [payload, ...state];
        case REMOVE_ERROR:
            return state.filter(error => error.id !== payload);
        default:
            return state;
    }
}