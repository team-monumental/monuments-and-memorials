import { CREATE_MONUMENT_PENDING, CREATE_MONUMENT_SUCCESS, CREATE_MONUMENT_ERROR } from "../constants";
import { LOCATION_CHANGE } from "connected-react-router";

const initialState = {
    createMonumentPending : false,
    monument: {},
    createError: null
};

// Tracks the progress for creating a new Monument for the CreatePage
export default function createPage(state = initialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return initialState;
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
                createError: action.error
            };
        default:
            return state;
    }
}