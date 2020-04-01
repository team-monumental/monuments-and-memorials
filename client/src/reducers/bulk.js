import {
    CREATE_BULK_SUGGESTION_PENDING, CREATE_BULK_SUGGESTION_SUCCESS, CREATE_BULK_SUGGESTION_ERROR,
    VALIDATE_BULK_SUGGESTION_PENDING, VALIDATE_BULK_SUGGESTION_SUCCESS, VALIDATE_BULK_SUGGESTION_ERROR
} from '../constants';
import { LOCATION_CHANGE } from 'connected-react-router';

const initialState = {
    bulkSuggestionCreatePending: false,
    bulkSuggestionValidatePending: false,
    result: {},
    error: null
};

// Tracks the progress for creating a BulkCreateMonumentSuggestion for the MonumentBulkCreatePage
export default function bulkCreatePage(state = initialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return initialState;
        case CREATE_BULK_SUGGESTION_PENDING:
            return {
                ...state,
                bulkSuggestionCreatePending: true,
                createProgress: action.progress
            };
        case CREATE_BULK_SUGGESTION_SUCCESS:
            return {
                ...state,
                bulkSuggestionCreatePending: false,
                createResult: action.payload
            };
        case CREATE_BULK_SUGGESTION_ERROR:
            return {
                ...state,
                bulkSuggestionCreatePending: false,
                createError: action.error
            };
        case VALIDATE_BULK_SUGGESTION_PENDING:
            return {
                ...state,
                bulkSuggestionValidatePending: true
            };
        case VALIDATE_BULK_SUGGESTION_SUCCESS:
            return {
                ...state,
                bulkSuggestionValidatePending: false,
                validationResult: action.payload
            };
        case VALIDATE_BULK_SUGGESTION_ERROR:
            return {
                ...state,
                bulkSuggestionValidatePending: false,
                validationError: action.error
            };
        default:
            return state;
    }
}