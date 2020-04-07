import {
    FETCH_MONUMENT_UPDATE_PENDING,
    FETCH_MONUMENT_UPDATE_SUCCESS,
    FETCH_MONUMENT_UPDATE_ERROR,
    UPDATE_MONUMENT_PENDING,
    UPDATE_MONUMENT_SUCCESS,
    UPDATE_MONUMENT_ERROR,
    TOGGLE_MONUMENT_IS_ACTIVE_PENDING,
    TOGGLE_MONUMENT_IS_ACTIVE_SUCCESS,
    TOGGLE_MONUMENT_IS_ACTIVE_ERROR, DELETE_MONUMENT_PENDING, DELETE_MONUMENT_SUCCESS, DELETE_MONUMENT_ERROR
} from '../constants';
import { LOCATION_CHANGE } from 'connected-react-router';
import basicReducer from '../utils/basic-reducer';

const initialState = {
    fetchMonumentForUpdatePending: false,
    updateMonumentPending: false,
    monument: {},
    updatedMonument: {},
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
        case UPDATE_MONUMENT_PENDING:
            return {
                ...state,
                updateMonumentPending: true,
            };
        case UPDATE_MONUMENT_SUCCESS:
            return {
                ...state,
                updateMonumentPending: false,
                updatedMonument: action.payload
            };
        case UPDATE_MONUMENT_ERROR:
            return {
                ...state,
                updateMonumentPending: false,
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