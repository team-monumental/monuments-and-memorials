import {
    CREATE_BULK_UPDATE_SUGGESTION_PENDING,
    CREATE_BULK_UPDATE_SUGGESTION_SUCCESS,
    CREATE_BULK_UPDATE_SUGGESTION_ERROR,
    VALIDATE_BULK_UPDATE_SUGGESTION_PENDING,
    VALIDATE_BULK_UPDATE_SUGGESTION_SUCCESS,
    VALIDATE_BULK_UPDATE_SUGGESTION_ERROR,
    BULK_UPDATE_MONUMENTS_PENDING,
    BULK_UPDATE_MONUMENTS_SUCCESS,
    BULK_UPDATE_MONUMENTS_ERROR
} from '../constants';
import { LOCATION_CHANGE } from 'connected-react-router';

const initialState = {
    bulkUpdateSuggestionCreatePending: false,
    bulkUpdateSuggestionValidatePending: false,
    bulkUpdatePending: false,
    result: {},
    error: null
};

// Tracks the progress for creating a BulkUpdateMonumentSuggestion for the MonumentBulkUpdatePage
export default function bulkUpdatePage(state = initialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return initialState;
        case CREATE_BULK_UPDATE_SUGGESTION_PENDING:
            return {
                ...state,
                bulkUpdateSuggestionCreatePending: true,
                createSuggestionProgress: action.progress
            };
        case CREATE_BULK_UPDATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                bulkUpdateSuggestionCreatePending: false,
                createSuggestionResult: action.payload
            };
        case CREATE_BULK_UPDATE_SUGGESTION_ERROR:
            return {
                ...state,
                bulkUpdateSuggestionCreatePending: false,
                createSuggestionError: action.error
            };
        case VALIDATE_BULK_UPDATE_SUGGESTION_PENDING:
            return {
                ...state,
                bulkUpdateSuggestionValidatePending: true
            };
        case VALIDATE_BULK_UPDATE_SUGGESTION_SUCCESS:
            return {
                ...state,
                bulkUpdateSuggestionValidatePending: false,
                validationResult: action.payload
            };
        case VALIDATE_BULK_UPDATE_SUGGESTION_ERROR:
            return {
                ...state,
                bulkUpdateSuggestionValidatePending: false,
                validationError: action.error
            };
        case BULK_UPDATE_MONUMENTS_PENDING:
            return {
                ...state,
                bulkUpdatePending: true,
                createProgress: action.progress
            };
        case BULK_UPDATE_MONUMENTS_SUCCESS:
            return {
                ...state,
                bulkUpdatePending: false,
                createResult: action.payload
            };
        case BULK_UPDATE_MONUMENTS_ERROR:
            return {
                ...state,
                bulkUpdatePending: false,
                createError: action.error
            };
        default:
            return state;
    }
}