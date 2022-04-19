import {
    CREATE_FAVORITE_ERROR,
    CREATE_FAVORITE_PENDING,
    CREATE_FAVORITE_SUCCESS,
    DELETE_FAVORITE_ERROR,
    DELETE_FAVORITE_PENDING,
    DELETE_FAVORITE_SUCCESS,
    FETCH_ALL_MONUMENTS_ERROR,
    FETCH_ALL_MONUMENTS_PENDING,
    FETCH_ALL_MONUMENTS_SUCCESS,
    FETCH_FAVORITE_ERROR,
    FETCH_FAVORITE_PENDING,
    FETCH_FAVORITE_SUCCESS,
    FETCH_MONUMENT_ERROR,
    FETCH_MONUMENT_PENDING,
    FETCH_MONUMENT_SUCCESS,
    FETCH_NEARBY_MONUMENTS_ERROR,
    FETCH_NEARBY_MONUMENTS_PENDING,
    FETCH_NEARBY_MONUMENTS_SUCCESS,
    FETCH_RELATED_MONUMENTS_ERROR,
    FETCH_RELATED_MONUMENTS_PENDING,
    FETCH_RELATED_MONUMENTS_SUCCESS
} from '../constants';
import {LOCATION_CHANGE} from 'connected-react-router';
import basicReducer from './basic';

const initialState = {
    fetchMonumentPending: false,
    fetchNearbyPending: false,
    fetchRelatedPending: false,
    fetchFavoritePending: false,
    monument: {},
    nearbyMonuments: {},
    relatedMonuments: {},
    favorite: null,
    fetchMonumentError: null,
    fetchNearbyError: null,
    fetchRelatedError: null,
    fetchFavoriteError: null
};

// Tracks the progress of getting the monument and related records for the monument record page
// As well as fetching the nearby and related Monuments for the Monument
export function monumentPage(state = initialState, action) {
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
                fetchMonumentError: action.error
            };
        case FETCH_ALL_MONUMENTS_PENDING:
            return {
                ...state,
                fetchAllPending: true
            };
        case FETCH_ALL_MONUMENTS_SUCCESS:
            return {
                ...state,
                fetchAllPending: false,
                allMonuments: action.payload
            };
        case FETCH_ALL_MONUMENTS_ERROR:
            return {
                ...state,
                fetchAllPending: false,
                fetchAllError: action.error
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
                fetchNearbyError: action.error
            };
        case FETCH_RELATED_MONUMENTS_PENDING:
            return {
                ...state,
                fetchRelatedPending: true
            };
        case FETCH_RELATED_MONUMENTS_SUCCESS:
            return {
                ...state,
                fetchRelatedPending: false,
                relatedMonuments: action.payload
            };
        case FETCH_RELATED_MONUMENTS_ERROR:
            return {
                ...state,
                fetchRelatedPending: false,
                fetchRelatedError: action.error
            };
        case FETCH_FAVORITE_PENDING:
            return {
                ...state,
                fetchFavoritePending: true
            };
        case FETCH_FAVORITE_SUCCESS:
            return {
                ...state,
                fetchFavoritePending: false,
                favorite: action.payload && action.payload.result
            };
        case FETCH_FAVORITE_ERROR:
            return {
                ...state,
                fetchFavoritePending: false,
                fetchFavoriteError: action.error
            };
        case LOCATION_CHANGE:
            return initialState;
        default:
            return state;
    }
}

const initialCreateFavoriteState = {
    pending: false,
    result: null,
    error: null
};

export function createFavorite(state = initialCreateFavoriteState, action) {
    return basicReducer(state, initialCreateFavoriteState, action, {
        pending: CREATE_FAVORITE_PENDING,
        success: CREATE_FAVORITE_SUCCESS,
        error: CREATE_FAVORITE_ERROR
    });
}

const initialDeleteFavoriteState = {
    pending: false,
    success: null,
    error: null
};

export function deleteFavorite(state = initialDeleteFavoriteState, action) {
    return basicReducer(state, initialDeleteFavoriteState, action, {
        pending: DELETE_FAVORITE_PENDING,
        success: DELETE_FAVORITE_SUCCESS,
        error: DELETE_FAVORITE_ERROR
    });
}