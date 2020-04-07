import {
    VALIDATE_BULK_SUGGESTION_PENDING,
    VALIDATE_BULK_SUGGESTION_SUCCESS,
    VALIDATE_BULK_SUGGESTION_ERROR,
    CREATE_BULK_SUGGESTION_PENDING,
    CREATE_BULK_SUGGESTION_SUCCESS,
    CREATE_BULK_SUGGESTION_ERROR,
    BULK_CREATE_MONUMENTS_PENDING, BULK_CREATE_MONUMENTS_SUCCESS, BULK_CREATE_MONUMENTS_ERROR
} from '../constants';
import { pending, success, error } from '../utils/action-util';

const actions = {
    validate: {
        pending: VALIDATE_BULK_SUGGESTION_PENDING,
        success: VALIDATE_BULK_SUGGESTION_SUCCESS,
        error: VALIDATE_BULK_SUGGESTION_ERROR,
        uri: '/api/suggestion/bulk/validate'
    },
    createSuggestion: {
        pending: CREATE_BULK_SUGGESTION_PENDING,
        success: CREATE_BULK_SUGGESTION_SUCCESS,
        error: CREATE_BULK_SUGGESTION_ERROR,
        uri: '/api/suggestion/bulk'
    },
    create: {
        pending: BULK_CREATE_MONUMENTS_PENDING,
        success: BULK_CREATE_MONUMENTS_SUCCESS,
        error: BULK_CREATE_MONUMENTS_ERROR,
        suggestUri: '/api/suggestion/bulk',
        approveUri: '/api/suggestion/bulk'
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
    return doAction(actions.createSuggestion, form, true);
}

export function bulkCreateMonuments(form) {
    return async dispatch => {
        dispatch(pending(actions.create));

        try {
            // Create the BulkCreateMonumentSuggestion
            let suggestResult = await (await fetch(actions.create.suggestUri, {
                method: 'post',
                body: buildFormData(form)
            })).json();

            const suggestJobId = suggestResult.id;

            let interval;
            await new Promise(resolve => {
                interval = window.setInterval(async () => {
                    suggestResult = await (await fetch(`${actions.create.suggestUri}/progress/${suggestJobId}`)).json();
                    // Divide the suggestion progress by 2 so it ranges from 0.0 to 0.50
                    dispatch(pending(actions.create, (suggestResult.progress / 2)));

                    if (suggestResult.future && suggestResult.future.done) resolve();
                }, 100);
            });
            window.clearInterval(interval);

            suggestResult = await (await fetch(`${actions.create.suggestUri}/result/${suggestJobId}`)).json();

            // Approve the BulkCreateMonumentSuggestion
            let approveResult = await (await fetch(`${actions.create.approveUri}/${suggestResult.id}/approve`, {
                method: 'put',
                body: buildFormData(form)
            })).json();

            const approveJobId = approveResult.id;

            await new Promise(resolve => {
                interval = window.setInterval(async () => {
                    approveResult = await (await fetch(`${actions.create.approveUri}/approve/progress/${approveJobId}`));
                    // Divide the approve progress by 2 then add 0.50 so it ranges from 0.50 to 1.00
                    dispatch(pending(actions.create, ((approveResult.progress / 2) + 0.50)));

                    if (approveResult.future && approveResult.future.done) resolve();
                }, 100);
            });
            window.clearInterval(interval);

            approveResult = await (await fetch(`${actions.create.approveUri}/approve/result/${approveJobId}`)).json();
            dispatch(success(actions.create), approveResult);
        } catch (err) {
            dispatch(error(actions.create, err));
        }
    }
}