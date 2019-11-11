import { SEARCH_MONUMENTS_PENDING, SEARCH_MONUMENTS_SUCCESS, SEARCH_MONUMENTS_ERROR } from '../constants';
import basicReducer from '../utils/basicReducer';

const initialState = {
    pending: false,
    monuments: [],
    count: 0,
    error: null
};

// Tracks the progress of getting search results and total result count on the search page
export default function searchPage(state = initialState, action) {
    return basicReducer(state, action, {
        pending: SEARCH_MONUMENTS_PENDING,
        success: SEARCH_MONUMENTS_SUCCESS,
        error: SEARCH_MONUMENTS_ERROR
    });
}