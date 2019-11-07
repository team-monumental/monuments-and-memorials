import { FETCH_MONUMENT_ERROR, FETCH_MONUMENT_PENDING, FETCH_MONUMENT_SUCCESS, FETCH_NEARBY_MONUMENTS_PENDING,
    FETCH_NEARBY_MONUMENTS_SUCCESS, FETCH_NEARBY_MONUMENTS_ERROR
} from '../constants';

const initialState = {
    fetchMonumentPending: false,
    fetchNearbyPending: false,
    monument: {},
    nearbyMonuments: {},
    error: null
};

// Tracks the progress of getting the monument and related records for the monument record page
// As well as fetching the nearby Monuments for the Monument
export default function monumentPage(state = initialState, action) {
    switch (action.type) {
        case FETCH_MONUMENT_PENDING:
            return {
                ...state,
                fetchMonumentPending: true
            };
        case FETCH_MONUMENT_SUCCESS:
            return {
                ...state,
                fetchMonumentPending: false,
                monument: action.payload
            };
        case FETCH_MONUMENT_ERROR:
            return {
                ...state,
                fetchMonumentPending: false,
                error: action.error
            };
        case FETCH_NEARBY_MONUMENTS_PENDING:
            return {
                ...state,
                fetchNearbyPending: true
            };
        case FETCH_NEARBY_MONUMENTS_SUCCESS:
            return {
                ...state,
                fetchNearbyPending: false,
                nearbyMonuments: action.payload
            };
        case FETCH_NEARBY_MONUMENTS_ERROR:
            return {
                ...state,
                fetchNearbyPending: false,
                error: action.error
            };
        default:
            return state;
    }
}