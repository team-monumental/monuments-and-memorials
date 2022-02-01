import {
    CREATE_UPDATE_SUGGESTION_ERROR,
    CREATE_UPDATE_SUGGESTION_PENDING,
    CREATE_UPDATE_SUGGESTION_SUCCESS,
    DELETE_MONUMENT_ERROR,
    DELETE_MONUMENT_PENDING,
    DELETE_MONUMENT_SUCCESS,
    FETCH_MONUMENT_UPDATE_ERROR,
    FETCH_MONUMENT_UPDATE_PENDING,
    FETCH_MONUMENT_UPDATE_SUCCESS,
    TOGGLE_MONUMENT_IS_ACTIVE_ERROR,
    TOGGLE_MONUMENT_IS_ACTIVE_PENDING,
    TOGGLE_MONUMENT_IS_ACTIVE_SUCCESS,
    UPDATE_MONUMENT_ERROR,
    UPDATE_MONUMENT_PENDING,
    UPDATE_MONUMENT_SUCCESS
} from '../constants';
import {LOCATION_CHANGE} from 'connected-react-router';
import basicReducer from '../utils/basic-reducer';

const initialState = {
    fetchMonumentForUpdatePending: false,
    createUpdateSuggestionPending: false,
    monument: {},
    updateSuggestion: {},
    error: null
};

export function updateMonumentPage(state = initialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return initialState;
        case FETCH_MONUMENT_UPDATE_PENDING:
            return {
                ...state,
                fetchMonumentForUpdatePending: true
            };
        case FETCH_MONUMENT_UPDATE_SUCCESS:
            return {
                ...state,
                fetchMonumentForUpdatePending: false,
                monument: action.payload
            };
        case FETCH_MONUMENT_UPDATE_ERROR:
            return {
                ...state,
                fetchMonumentForUpdatePending: false,
                error: action.error
            };
        case CREATE_UPDATE_SUGGESTION_PENDING:
            return {
                ...state,
                createUpdateSuggestionPending: true,
            };
        case CREATE_UPDATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                createUpdateSuggestionPending: false,
                updateSuggestion: action.payload
            };
        case CREATE_UPDATE_SUGGESTION_ERROR:
            return {
                ...state,
                createUpdateSuggestionPending: false,
                error: action.error
            };
        default:
            return state;
    }
}

const initialToggleActiveState = {
    pending: false,
    result: null,
    error: null
};

export function toggleMonumentIsActive(state = initialToggleActiveState, action) {
    return basicReducer(state, initialToggleActiveState, action, {
        pending: TOGGLE_MONUMENT_IS_ACTIVE_PENDING,
        success: TOGGLE_MONUMENT_IS_ACTIVE_SUCCESS,
        error: TOGGLE_MONUMENT_IS_ACTIVE_ERROR
    });
}

const initialDeleteState = {
    pending: false,
    success: null,
    error: null
};

export function deleteMonument(state = initialDeleteState, action) {
    return basicReducer(state, initialDeleteState, action, {
        pending: DELETE_MONUMENT_PENDING,
        success: DELETE_MONUMENT_SUCCESS,
        error: DELETE_MONUMENT_ERROR
    });
}

const initialUpdateState = {
    updatePending: false,
    updatedMonument: {},
    updateError: null
};

export function updateMonument(state = initialUpdateState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return initialUpdateState;
        case UPDATE_MONUMENT_PENDING:
            return {
                ...state,
                updatePending: true,
            };
        case UPDATE_MONUMENT_SUCCESS:
            return {
                ...state,
                updatePending: false,
                updatedMonument: action.payload
            };
        case UPDATE_MONUMENT_ERROR:
            return {
                ...state,
                updatePending: false,
                updateError: action.error
            };
        default:
            return state;
    }
}