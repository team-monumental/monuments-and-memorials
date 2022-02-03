import {
    CREATE_CREATE_SUGGESTION_ERROR,
    CREATE_CREATE_SUGGESTION_PENDING,
    CREATE_CREATE_SUGGESTION_SUCCESS,
    CREATE_MONUMENT_ERROR,
    CREATE_MONUMENT_PENDING,
    CREATE_MONUMENT_SUCCESS
} from '../constants';
import {post} from '../utils/api-util';
import {addError} from './errors';
import {error, pending, success} from '../utils/action-util';

const actions = {
    createCreateSuggestion: {
        pending: CREATE_CREATE_SUGGESTION_PENDING,
        success: CREATE_CREATE_SUGGESTION_SUCCESS,
        error: CREATE_CREATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/create'
    },
    createMonument: {
        pending: CREATE_MONUMENT_PENDING,
        success: CREATE_MONUMENT_SUCCESS,
        error: CREATE_MONUMENT_ERROR,
        uri: '/api/monument/create'
    }
};

export function createCreateSuggestion(createSuggestion) {
    return doAction(actions.createCreateSuggestion, createSuggestion);
}

export function createMonument(createSuggestion) {
    return doAction(actions.createMonument, createSuggestion);
}

function doAction(action, parameter) {
    return async dispatch => {
        dispatch(pending(action));

        try {
            const result = await post(action.uri, parameter);
            dispatch(success(action, result));
        } catch (err) {
            dispatch(error(action, err));
            dispatch(addError({
                message: err.message
            }));
        }
    };
}