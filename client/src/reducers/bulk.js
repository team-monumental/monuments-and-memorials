import {
    BULK_SUGGESTION_CREATE_PENDING, BULK_SUGGESTION_CREATE_SUCCESS, BULK_SUGGESTION_CREATE_ERROR,
    BULK_SUGGESTION_VALIDATE_PENDING, BULK_SUGGESTION_VALIDATE_SUCCESS, BULK_SUGGESTION_VALIDATE_ERROR
} from '../constants';

const initialState = {
    bulkSuggestionCreatePending: false,
    bulkSuggestionValidatePending: false,
    result: {},
    error: null
};

// Tracks the progress for bulk creating Monuments via CSV or .zip upload for the MonumentBulkCreatePage
export default function bulkCreatePage(state = initialState, action) {
    switch (action.type) {
        case BULK_SUGGESTION_CREATE_PENDING:
            return {
                ...state,
                bulkSuggestionCreatePending: true,
                createProgress: action.progress
            };
        case BULK_SUGGESTION_CREATE_SUCCESS:
            return {
                ...state,
                bulkSuggestionCreatePending: false,
                createResult: action.payload
            };
        case BULK_SUGGESTION_CREATE_ERROR:
            return {
                ...state,
                bulkSuggestionCreatePending: false,
                createError: action.error
            };
        case BULK_SUGGESTION_VALIDATE_PENDING:
            return {
                ...state,
                bulkSuggestionValidatePending: true
            };
        case BULK_SUGGESTION_VALIDATE_SUCCESS:
            return {
                ...state,
                bulkSuggestionValidatePending: false,
                validationResult: action.payload
            };
        case BULK_SUGGESTION_VALIDATE_ERROR:
            return {
                ...state,
                bulkSuggestionValidatePending: false,
                validationError: action.error
            };
        default:
            return state;
    }
}