import { CREATE_MONUMENT_PENDING, CREATE_MONUMENT_SUCCESS, CREATE_MONUMENT_ERROR } from "../constants";
import basicReducer from "../utils/basicReducer";

const initialState = {
    createMonumentPending : false,
    monument: {},
    error: null
};

// Tracks the progress for creating a new Monument for the CreatePage
export default function createPage(state = initialState, action) {
    return basicReducer(state, action, {
        pending: CREATE_MONUMENT_PENDING,
        success: CREATE_MONUMENT_SUCCESS,
        error: CREATE_MONUMENT_ERROR
    });
}