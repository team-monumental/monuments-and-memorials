import { CREATE_MONUMENT_PENDING, CREATE_MONUMENT_SUCCESS, CREATE_MONUMENT_ERROR } from "../constants";
import { post } from "../utils/api-util";
import { addError } from './errors';
import { pending, success, error } from '../utils/action-util';

const actions = {
    create: {
        pending: CREATE_MONUMENT_PENDING,
        success: CREATE_MONUMENT_SUCCESS,
        error: CREATE_MONUMENT_ERROR,
        uri: '/api/monument'
    }
};

export default function createMonument(monument) {
    return async dispatch => {
        dispatch(pending(actions.create));
        try {
            const createdMonument = await post(actions.create.uri, monument);
            dispatch(success(actions.create, {payload: createdMonument}));
        } catch (err) {
            dispatch(error(actions.create, err));
            dispatch(addError({
                message: err.message
            }));
        }
    };
}