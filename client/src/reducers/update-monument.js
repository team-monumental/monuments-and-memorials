import { FETCH_MONUMENT_UPDATE_PENDING, FETCH_MONUMENT_UPDATE_SUCCESS, FETCH_MONUMENT_UPDATE_ERROR } from '../constants';

const initialState = {
    fetchMonumentForUpdatePending: false,
    monument: {},
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
        default:
            return state;
    }
}