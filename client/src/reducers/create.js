import { CREATE_CREATE_SUGGESTION_PENDING, CREATE_CREATE_SUGGESTION_SUCCESS, CREATE_CREATE_SUGGESTION_ERROR } from '../constants';

const initialState = {
    createCreateSuggestionPending : false,
    createSuggestion: {},
    createError: null
};

// Tracks the progress for creating a new CreateMonumentSuggestion for the CreatePage
export default function createPage(state = initialState, action) {
    switch (action.type) {
        case CREATE_CREATE_SUGGESTION_PENDING:
            return {
                ...state,
                createCreateSuggestionPending: true
            };
        case CREATE_CREATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                createCreateSuggestionPending: false,
                createSuggestion: action.payload
            };
        case CREATE_CREATE_SUGGESTION_ERROR:
            return {
                ...state,
                createCreateSuggestionPending: false,
                createError: action.error
            };
        default:
            return state;
    }
}