import { CREATE_SUGGESTION_PENDING, CREATE_SUGGESTION_SUCCESS, CREATE_SUGGESTION_ERROR } from '../constants';

const initialState = {
    createSuggestionPending : false,
    suggestion: {},
    createError: null
};

// Tracks the progress for creating a new Monument for the CreatePage
export default function createPage(state = initialState, action) {
    switch (action.type) {
        case CREATE_SUGGESTION_PENDING:
            return {
                ...state,
                createSuggestionPending: true
            };
        case CREATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                createSuggestionPending: false,
                suggestion: action.payload
            };
        case CREATE_SUGGESTION_ERROR:
            return {
                ...state,
                createSuggestionPending: false,
                createError: action.error
            };
        default:
            return state;
    }
}