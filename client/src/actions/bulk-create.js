import {
    BULK_CREATE_MONUMENTS_PENDING, BULK_CREATE_MONUMENTS_SUCCESS, BULK_CREATE_MONUMENTS_ERROR,
    BULK_CREATE_MONUMENTS_ZIP_PENDING, BULK_CREATE_MONUMENTS_ZIP_SUCCESS, BULK_CREATE_MONUMENTS_ZIP_ERROR
} from '../constants';
import { post, postFile } from '../utils/api-util';
import {addError} from "./errors";

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
            dispatch(addError({
                message: error.message
            }));
        }
    };
}

function bulkCreateMonumentsZipPending() {
    return {
        type: BULK_CREATE_MONUMENTS_ZIP_PENDING
    };
}

function bulkCreateMonumentsZipSuccess(result) {
    return {
        type: BULK_CREATE_MONUMENTS_ZIP_SUCCESS,
        payload: result
    };
}

function bulkCreateMonumentsZipError(error) {
    return {
        type: BULK_CREATE_MONUMENTS_ZIP_ERROR,
        error: error
    };
}

export function bulkCreateMonumentsZip(zipFile) {
    return async dispatch => {
        dispatch(bulkCreateMonumentsZipPending());

        try {
            const result = await postFile('/api/monument/bulk-create/zip', zipFile);
            dispatch(bulkCreateMonumentsZipSuccess(result));
        } catch (error) {
            dispatch(bulkCreateMonumentsZipError(error));
            dispatch(addError({
                message: error.message
            }));
        }
    };
}