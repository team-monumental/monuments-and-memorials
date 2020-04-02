import {
    VALIDATE_BULK_SUGGESTION_PENDING, VALIDATE_BULK_SUGGESTION_SUCCESS, VALIDATE_BULK_SUGGESTION_ERROR,
    CREATE_BULK_SUGGESTION_PENDING, CREATE_BULK_SUGGESTION_SUCCESS, CREATE_BULK_SUGGESTION_ERROR
} from '../constants';
import { pending, success, error } from '../utils/action-util';

const actions = {
    validate: {
        pending: VALIDATE_BULK_SUGGESTION_PENDING,
        success: VALIDATE_BULK_SUGGESTION_SUCCESS,
        error: VALIDATE_BULK_SUGGESTION_ERROR,
        uri: '/api/suggestion/bulk/validate'
    },
    create: {
        pending: CREATE_BULK_SUGGESTION_PENDING,
        success: CREATE_BULK_SUGGESTION_SUCCESS,
        error: CREATE_BULK_SUGGESTION_ERROR,
        uri: '/api/suggestion/bulk'
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

function doAction(action, form, isAsyncJob=false) {
    return async dispatch => {
        dispatch(pending(action));
        try {
            let result = await (await fetch(action.uri, {
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
                    }, 100);
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

export function bulkValidateSuggestions(form) {
    return doAction(actions.validate, form);
}

export function bulkCreateSuggestions(form) {
    return doAction(actions.create, form, true);
}