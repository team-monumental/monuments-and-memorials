import { BULK_CREATE_MONUMENTS_PENDING, BULK_CREATE_MONUMENTS_SUCCESS, BULK_CREATE_MONUMENTS_ERROR } from '../constants';

const initialState = {
    bulkCreateMonumentsPending: false,
    result: {},
    error: null
};

// Tracks the progress for bulk creating Monuments via CSV upload for the MonumentBulkCreatePage
export default function bulkCreatePage(state = initialState, action) {
    switch (action.type) {
        case BULK_CREATE_MONUMENTS_PENDING:
            return {
                ...state,
                bulkCreateMonumentsPending: true
            };
        case BULK_CREATE_MONUMENTS_SUCCESS:
            return {
                ...state,
                bulkCreateMonumentsPending: false,
                result: action.payload
            };
        case BULK_CREATE_MONUMENTS_ERROR:
            return {
                ...state,
                bulkCreateMonumentsPending: false,
                error: action.error
            };
        default:
            return state;
    }
}