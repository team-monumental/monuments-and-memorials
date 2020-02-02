import {
    BULK_CREATE_MONUMENTS_PENDING, BULK_CREATE_MONUMENTS_SUCCESS, BULK_CREATE_MONUMENTS_ERROR,
    BULK_CREATE_MONUMENTS_ZIP_PENDING, BULK_CREATE_MONUMENTS_ZIP_SUCCESS, BULK_CREATE_MONUMENTS_ZIP_ERROR
} from '../constants';
import { post, postFile } from '../utils/api-util';
import { addError } from './errors';

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

export function bulkCreateMonuments(form) {
    return async dispatch => {
        dispatch(bulkCreateMonumentsZipPending());

        try {
            console.log('POST', form);

            var formData = new FormData();

            if (form.csv) {
                formData.append('csv', form.csv);
            } else if (form.zip) {
                formData.append('zip', form.zip);
            }

            formData.append('mapping', new Blob([form.mapping], {
                type: 'application/json'
            }));
            const result = await fetch('/api/monument/bulk-create', {
                method: 'post',
                body: formData
            });
            // const result = await post('/api/monument/bulk-create', form, 'multipart/form-data');
            dispatch(bulkCreateMonumentsZipSuccess(result));
        } catch (error) {
            dispatch(bulkCreateMonumentsZipError(error));
        }
    };
}