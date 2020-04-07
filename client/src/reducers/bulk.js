import {
    CREATE_BULK_SUGGESTION_PENDING, CREATE_BULK_SUGGESTION_SUCCESS, CREATE_BULK_SUGGESTION_ERROR,
    VALIDATE_BULK_SUGGESTION_PENDING, VALIDATE_BULK_SUGGESTION_SUCCESS, VALIDATE_BULK_SUGGESTION_ERROR,
    BULK_CREATE_MONUMENTS_PENDING, BULK_CREATE_MONUMENTS_SUCCESS, BULK_CREATE_MONUMENTS_ERROR
} from '../constants';
import { LOCATION_CHANGE } from 'connected-react-router';

const initialState = {
    bulkSuggestionCreatePending: false,
    bulkSuggestionValidatePending: false,
    bulkCreatePending: false,
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
                createSuggestionProgress: action.progress
            };
        case CREATE_BULK_SUGGESTION_SUCCESS:
            return {
                ...state,
                bulkSuggestionCreatePending: false,
                createSuggestionResult: action.payload
            };
        case CREATE_BULK_SUGGESTION_ERROR:
            return {
                ...state,
                bulkSuggestionCreatePending: false,
                createSuggestionError: action.error
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
        case BULK_CREATE_MONUMENTS_PENDING:
            return {
                ...state,
                bulkCreatePending: true,
                createProgress: action.progress
            };
        case BULK_CREATE_MONUMENTS_SUCCESS:
            return {
                ...state,
                bulkCreatePending: false,
                createResult: action.payload
            };
        case BULK_CREATE_MONUMENTS_ERROR:
            return {
                ...state,
                bulkCreatePending: false,
                createError: action.error
            };
        default:
            return state;
    }
}