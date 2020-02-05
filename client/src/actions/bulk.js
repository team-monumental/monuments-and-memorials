import {
    BULK_VALIDATE_MONUMENTS_PENDING, BULK_VALIDATE_MONUMENTS_SUCCESS, BULK_VALIDATE_MONUMENTS_ERROR,
    BULK_CREATE_MONUMENTS_PENDING, BULK_CREATE_MONUMENTS_SUCCESS, BULK_CREATE_MONUMENTS_ERROR
} from '../constants';
import { post, postFile } from '../utils/api-util';
import { addError } from './errors';

const actions = {
    validate: 'validate',
    create: 'create'
};

function pending(action) {
    return {
        type: action === actions.validate ? BULK_VALIDATE_MONUMENTS_PENDING : BULK_CREATE_MONUMENTS_PENDING
    };
}

function success(action, result) {
    return {
        type: action === actions.validate ? BULK_VALIDATE_MONUMENTS_SUCCESS : BULK_CREATE_MONUMENTS_SUCCESS,
        payload: result
    };
}

function error(action, error) {
    return {
        type: action === actions.validate ? BULK_VALIDATE_MONUMENTS_ERROR : BULK_CREATE_MONUMENTS_ERROR,
        error: error
    };
}

function buildFormData(form) {
    const formData = new FormData();
    if (form.csv) {
        formData.append('csv', form.csv);
    } else if (form.zip) {
        formData.append('zip', form.zip);
    }

    formData.append('mapping', new Blob([form.mapping], {
        type: 'application/json'
    }));

    return formData;
}

function doAction(action, form) {
    return async dispatch => {
        dispatch(pending(action));
        try {
            const result = await fetch('/api/monument/bulk/' + action, {
                method: 'post',
                body: buildFormData(form)
            });
            dispatch(success(action, await result.json()));
        } catch (err) {
            dispatch(error(action, err));
        }
    };
}

export function bulkValidateMonuments(form) {
    return doAction(actions.validate, form);
}

export function bulkCreateMonuments(form) {
    return doAction(actions.create, form);
}