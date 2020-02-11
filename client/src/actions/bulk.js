import {
    BULK_VALIDATE_MONUMENTS_PENDING, BULK_VALIDATE_MONUMENTS_SUCCESS, BULK_VALIDATE_MONUMENTS_ERROR,
    BULK_CREATE_MONUMENTS_PENDING, BULK_CREATE_MONUMENTS_SUCCESS, BULK_CREATE_MONUMENTS_ERROR
} from '../constants';

const actions = {
    validate: 'validate',
    create: 'create'
};

function pending(action, progress) {
    return {
        type: action === actions.validate ? BULK_VALIDATE_MONUMENTS_PENDING : BULK_CREATE_MONUMENTS_PENDING,
        progress
    };
}

function success(action, payload) {
    return {
        type: action === actions.validate ? BULK_VALIDATE_MONUMENTS_SUCCESS : BULK_CREATE_MONUMENTS_SUCCESS,
        payload
    };
}

function error(action, error) {
    return {
        type: action === actions.validate ? BULK_VALIDATE_MONUMENTS_ERROR : BULK_CREATE_MONUMENTS_ERROR,
        error
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

function doAction(action, form, isAsyncJob) {
    return async dispatch => {
        dispatch(pending(action));
        try {
            let result = await (await fetch('/api/monument/bulk/' + action + (isAsyncJob ? '/start' : ''), {
                method: 'post',
                body: buildFormData(form)
            })).json();

            if (isAsyncJob) {
                const jobId = result.id;

                let interval;
                await new Promise(resolve => {
                    interval = window.setInterval(async () => {
                        result = await (await fetch(`/api/monument/bulk/${action}/progress/${jobId}`)).json();
                        dispatch(pending(action, result.progress));

                        if (result.future.done) resolve();
                    }, 200);
                });
                window.clearInterval(interval);

                result = await (await fetch(`/api/monument/bulk/${action}/result/${jobId}`)).json();
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