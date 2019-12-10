import { BULK_CREATE_MONUMENTS_PENDING, BULK_CREATE_MONUMENTS_SUCCESS, BULK_CREATE_MONUMENTS_ERROR } from "../constants";
import { post } from "../utils/api-util";

function bulkCreateMonumentsPending() {
    return {
        type: BULK_CREATE_MONUMENTS_PENDING
    };
}

function bulkCreateMonumentsSuccess(result) {
    return {
        type: BULK_CREATE_MONUMENTS_SUCCESS,
        payload: result
    };
}

function bulkCreateMonumentsError(error) {
    return {
        type: BULK_CREATE_MONUMENTS_ERROR,
        error: error
    };
}

export default function bulkCreateMonuments(csvContents) {
    return async dispatch => {
        dispatch(bulkCreateMonumentsPending());

        try {
            const result = await post('/api/monument/bulk-create', csvContents);
            dispatch(bulkCreateMonumentsSuccess(result));
        } catch (error) {
            dispatch(bulkCreateMonumentsError(error));
        }
    };
}