import { FETCH_MAP_MONUMENTS_PENDING, FETCH_MAP_MONUMENTS_SUCCESS, FETCH_MAP_MONUMENTS_ERROR } from '../constants';

const initialState = {
    pending: false,
    monuments: [],
    error: null
};

// Tracks the progress of getting the monuments for the monument map page
export default function mapPage(state = initialState, action) {
    switch (action.type) {
        case FETCH_MAP_MONUMENTS_PENDING:
            return {
                ...state,
                pending: true
            };
        case FETCH_MAP_MONUMENTS_SUCCESS:
            return {
                ...state,
                pending: false,
                monuments: action.payload
            };
        case FETCH_MAP_MONUMENTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}