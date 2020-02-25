import { FETCH_DUPLICATES_PENDING, FETCH_DUPLICATES_SUCCESS, FETCH_DUPLICATES_ERROR } from '../constants';

const initialState = {
    fetchDuplicatesPending: false,
    duplicates: undefined,
    duplicatesError: null
};

// Tracks the progress for fetching duplicate Monuments
export default function duplicateMonuments(state = initialState, action) {
    switch (action.type) {
        case FETCH_DUPLICATES_PENDING:
            return {
                ...state,
                fetchDuplicatesPending: true,
                duplicates: undefined
            };
        case FETCH_DUPLICATES_SUCCESS:
            return {
                ...state,
                fetchDuplicatesPending: false,
                duplicates: action.payload
            };
        case FETCH_DUPLICATES_ERROR:
            return {
                ...state,
                fetchDuplicatesPending: false,
                duplicatesError: action.error
            };
        default:
            return state;
    }
}