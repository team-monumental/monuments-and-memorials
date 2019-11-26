import { CREATE_MONUMENT_PENDING, CREATE_MONUMENT_SUCCESS, CREATE_MONUMENT_ERROR } from "../constants";

const initialState = {
    createMonumentPending : false,
    monument: {},
    error: null
};

export default function createPage(state = initialState, action) {
    switch (action.type) {
        case CREATE_MONUMENT_PENDING:
            return {
                ...state,
                createMonumentPending: true
            };
        case CREATE_MONUMENT_SUCCESS:
            return {
                ...state,
                createMonumentPending: false,
                monument: action.payload
            };
        case CREATE_MONUMENT_ERROR:
            return {
                ...state,
                createMonumentPending: false,
                error: action.error
            };
        default:
            return state;
    }
}