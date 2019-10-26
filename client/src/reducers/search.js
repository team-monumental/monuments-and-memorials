import { SEARCH_MONUMENTS_PENDING, SEARCH_MONUMENTS_SUCCESS, SEARCH_MONUMENTS_ERROR } from '../constants';

const initialState = {
    pending: false,
    monuments: [],
    count: 0,
    error: null
};

export default function searchPage(state = initialState, action) {
    switch (action.type) {
        case SEARCH_MONUMENTS_PENDING:
            return {
                ...state,
                pending: true
            };
        case SEARCH_MONUMENTS_SUCCESS:
            return {
                ...state,
                pending: false,
                ...action.payload
            };
        case SEARCH_MONUMENTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}