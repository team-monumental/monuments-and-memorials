import { CREATE_CREATE_SUGGESTION_PENDING, CREATE_CREATE_SUGGESTION_SUCCESS, CREATE_CREATE_SUGGESTION_ERROR } from '../constants';
import { post } from '../utils/api-util';
import { addError } from './errors';
import { pending, success, error } from '../utils/action-util';

const actions = {
    createCreateSuggestion: {
        pending: CREATE_CREATE_SUGGESTION_PENDING,
        success: CREATE_CREATE_SUGGESTION_SUCCESS,
        error: CREATE_CREATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/create'
    }
};

export default function createCreateSuggestion(createSuggestion) {
    return async dispatch => {
        dispatch(pending(actions.createCreateSuggestion));
        try {
            const createdCreateSuggestion = await post(actions.createCreateSuggestion.uri, createSuggestion);
            dispatch(success(actions.createCreateSuggestion, createdCreateSuggestion));
        } catch (err) {
            dispatch(error(actions.createCreateSuggestion, err));
            dispatch(addError({
                message: err.message
            }));
        }
    };
}