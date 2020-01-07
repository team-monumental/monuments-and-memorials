import {
    FETCH_MONUMENT_UPDATE_PENDING,
    FETCH_MONUMENT_UPDATE_SUCCESS,
    FETCH_MONUMENT_UPDATE_ERROR,
    UPDATE_MONUMENT_PENDING, UPDATE_MONUMENT_SUCCESS, UPDATE_MONUMENT_ERROR
} from '../constants';

const initialState = {
    fetchMonumentForUpdatePending: false,
    updateMonumentPending: false,
    monument: {},
    updatedMonument: {},
    error: null
};

export default function updateMonumentPage(state = initialState, action) {
    switch (action.type) {
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