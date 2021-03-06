import { FETCH_MAP_MONUMENTS_PENDING, FETCH_MAP_MONUMENTS_SUCCESS, FETCH_MAP_MONUMENTS_ERROR } from '../constants';
import basicReducer from '../utils/basic-reducer';

const initialState = {
    pending: false,
    monuments: [],
    error: null
};

// Tracks the progress of getting the monuments for the monument map page
export default function mapPage(state = initialState, action) {
    return basicReducer(state, initialState, action, {
        pending: FETCH_MAP_MONUMENTS_PENDING,
        success: FETCH_MAP_MONUMENTS_SUCCESS,
        error: FETCH_MAP_MONUMENTS_ERROR
    }, false);
}