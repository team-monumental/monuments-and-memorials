import { CREATE_SUGGESTION_PENDING, CREATE_SUGGESTION_SUCCESS, CREATE_SUGGESTION_ERROR } from '../constants';
import { post } from '../utils/api-util';
import { addError } from './errors';
import { pending, success, error } from '../utils/action-util';

const actions = {
    create: {
        pending: CREATE_SUGGESTION_PENDING,
        success: CREATE_SUGGESTION_SUCCESS,
        error: CREATE_SUGGESTION_ERROR,
        uri: '/api/suggestion/create'
    }
};

export default function createSuggestion(suggestion) {
    return async dispatch => {
        dispatch(pending(actions.create));
        try {
            const createdSuggestion = await post(actions.create.uri, suggestion);
            dispatch(success(actions.create, createdSuggestion));
        } catch (err) {
            dispatch(error(actions.create, err));
            dispatch(addError({
                message: err.message
            }));
        }
    };
}