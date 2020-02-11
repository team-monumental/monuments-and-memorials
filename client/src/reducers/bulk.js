import {
    BULK_CREATE_MONUMENTS_PENDING, BULK_CREATE_MONUMENTS_SUCCESS, BULK_CREATE_MONUMENTS_ERROR,
    BULK_VALIDATE_MONUMENTS_PENDING, BULK_VALIDATE_MONUMENTS_SUCCESS, BULK_VALIDATE_MONUMENTS_ERROR
} from '../constants';

const initialState = {
    bulkCreateMonumentsPending: false,
    bulkValidateMonumentsPending: false,
    result: {},
    error: null
};

// Tracks the progress for bulk creating Monuments via CSV or .zip upload for the MonumentBulkCreatePage
export default function bulkCreatePage(state = initialState, action) {
    switch (action.type) {
        case BULK_CREATE_MONUMENTS_PENDING:
            return {
                ...state,
                bulkCreateMonumentsPending: true,
                createProgress: action.progress
            };
        case BULK_CREATE_MONUMENTS_SUCCESS:
            return {
                ...state,
                bulkCreateMonumentsPending: false,
                createResult: action.payload
            };
        case BULK_CREATE_MONUMENTS_ERROR:
            return {
                ...state,
                bulkCreateMonumentsPending: false,
                createError: action.error
            };
        case BULK_VALIDATE_MONUMENTS_PENDING:
            return {
                ...state,
                bulkValidateMonumentsPending: true
            };
        case BULK_VALIDATE_MONUMENTS_SUCCESS:
            return {
                ...state,
                bulkValidateMonumentsPending: false,
                validationResult: action.payload
            };
        case BULK_VALIDATE_MONUMENTS_ERROR:
            return {
                ...state,
                bulkValidateMonumentsPending: false,
                validationError: action.error
            };
        default:
            return state;
    }
}