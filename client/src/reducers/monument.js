import { FETCH_MONUMENT_ERROR, FETCH_MONUMENT_PENDING, FETCH_MONUMENT_SUCCESS } from '../constants';

const initialState = {
    pending: false,
    monument: {},
    error: null
};

// Tracks the progress of getting the monument and related records for the monument record page
export default function monumentPage(state = initialState, action) {
    switch (action.type) {
        case FETCH_MONUMENT_PENDING:
            return {
                ...state,
                pending: true
            };
        case FETCH_MONUMENT_SUCCESS:
            return {
                ...state,
                pending: false,
                monument: action.payload
            };
        case FETCH_MONUMENT_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}