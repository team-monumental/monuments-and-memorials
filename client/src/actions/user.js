import {
    UPDATE_USER_ERROR, UPDATE_USER_PENDING, UPDATE_USER_SUCCESS, UPDATE_USER_RESET,
    UPDATE_EMAIL_ERROR, UPDATE_EMAIL_PENDING, UPDATE_EMAIL_SUCCESS
} from '../constants';
import { reset, error, pending, success } from '../utils/action-util';
import { post, put } from '../utils/api-util';
import { getUserSession } from './authentication';

const actions = {
    update: {
        pending: UPDATE_USER_PENDING,
        success: UPDATE_USER_SUCCESS,
        error: UPDATE_USER_ERROR,
        reset: UPDATE_USER_RESET,
        uri: '/api/user'
    },
    confirm: {
        pending: UPDATE_EMAIL_PENDING,
        success: UPDATE_EMAIL_SUCCESS,
        error: UPDATE_EMAIL_ERROR,
        uri: '/api/user/change-email/confirm'
    }
};

export function updateUser(user) {
    return async dispatch => {
        dispatch(pending(actions.update));
        try {
            const result = await put(actions.update.uri, user);
            if (result.success) {
                dispatch(success(actions.update, result));
                dispatch(getUserSession());
            } else {
                dispatch(error(actions.update, true));
            }
        } catch (err) {
            console.error(err);
            dispatch(error(actions.update, err.message));
        }
    }
}

export function clearUpdateUser() {
    return reset(actions.update);
}

export function confirmEmailChange(token) {
    return async dispatch => {
        dispatch(pending(actions.confirm));
        try {
            const result = await post(actions.confirm.uri + '?token=' + token);
            if (result.success) {
                dispatch(success(actions.confirm, {success: true}));
                dispatch(getUserSession());
            } else {
                dispatch(error(actions.confirm, true));
            }
        } catch (err) {
            dispatch(error(actions.confirm, err.message));
        }
    };
}
