import {
    BULK_VALIDATE_MONUMENTS_PENDING, BULK_VALIDATE_MONUMENTS_SUCCESS, BULK_VALIDATE_MONUMENTS_ERROR,
    BULK_CREATE_MONUMENTS_PENDING, BULK_CREATE_MONUMENTS_SUCCESS, BULK_CREATE_MONUMENTS_ERROR
} from '../constants';
import { pending, success, error } from '../utils/action-util';

const actions = {
    validate: {
        pending: BULK_VALIDATE_MONUMENTS_PENDING,
        success: BULK_VALIDATE_MONUMENTS_SUCCESS,
        error: BULK_VALIDATE_MONUMENTS_ERROR,
        uri: '/api/monument/bulk/validate'
    },
    create: {
        pending: BULK_CREATE_MONUMENTS_PENDING,
        success: BULK_CREATE_MONUMENTS_SUCCESS,
        error: BULK_VALIDATE_MONUMENTS_ERROR,
        uri: '/api/monument/bulk/create'
    }
};

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

function doAction(action, form, isAsyncJob) {
    return async dispatch => {
        dispatch(pending(action));
        try {
            let result = await (await fetch(action.uri + (isAsyncJob ? '/start' : ''), {
                method: 'post',
                body: buildFormData(form)
            })).json();

            if (isAsyncJob) {
                const jobId = result.id;

                let interval;
                await new Promise(resolve => {
                    interval = window.setInterval(async () => {
                        result = await (await fetch(`${action.uri}/progress/${jobId}`)).json();
                        dispatch(pending(action, result.progress));

                        if (result.future && result.future.done) resolve();
                    }, 200);
                });
                window.clearInterval(interval);

                result = await (await fetch(`${action.uri}/result/${jobId}`)).json();
            }

            dispatch(success(action, result));
        } catch (err) {
            dispatch(error(action, err));
        }
    };
}

export function bulkValidateMonuments(form) {
    return doAction(actions.validate, form);
}

export function bulkCreateMonuments(form) {
    return doAction(actions.create, form, true);
}