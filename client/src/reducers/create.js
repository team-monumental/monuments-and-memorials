import { CREATE_CREATE_SUGGESTION_PENDING, CREATE_CREATE_SUGGESTION_SUCCESS,
    CREATE_CREATE_SUGGESTION_ERROR, CREATE_MONUMENT_PENDING, CREATE_MONUMENT_SUCCESS,
    CREATE_MONUMENT_ERROR } from '../constants';
import { LOCATION_CHANGE } from 'connected-react-router';

const createCreateSuggestionInitialState = {
    createCreateSuggestionPending : false,
    createSuggestion: {},
    createError: null
};

const createMonumentInitialState = {
    createMonumentPending: false,
    monument: {},
    createMonumentError: null
};

// Tracks the progress for creating a new CreateMonumentSuggestion for the CreatePage
export function createCreateSuggestion(state = createCreateSuggestionInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return initialState;
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

export function createMonument(state = createMonumentInitialState, action) {
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
                createMonumentError: action.error
            };
        default:
            return state;
    }
}