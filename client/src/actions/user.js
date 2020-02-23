import {
    UPDATE_USER_ERROR, UPDATE_USER_PENDING, UPDATE_USER_SUCCESS, UPDATE_USER_RESET,
    UPDATE_EMAIL_ERROR, UPDATE_EMAIL_PENDING, UPDATE_EMAIL_SUCCESS, FETCH_FAVORITES_PENDING, FETCH_FAVORITES_SUCCESS, FETCH_FAVORITES_ERROR
} from '../constants';
import { reset, error, pending, success } from '../utils/action-util';
import { get, post, put } from '../utils/api-util';
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
    },
    favorites: {
        pending: FETCH_FAVORITES_PENDING,
        success: FETCH_FAVORITES_SUCCESS,
        error: FETCH_FAVORITES_ERROR,
        uri: '/api/favorites'
    }
};

export function updateUser(user) {
    return async dispatch => {
        dispatch(pending(actions.update));
        try {
            const result = await put(actions.update.uri, user);
            if (result.success) {
                dispatch(success(actions.update, result));
                // Get the user session again so that it has up to date info
                // If the email address was changed, don't get the session as it will log the user out prematurely
                if (!result.needsConfirmation) {
                    dispatch(getUserSession());
                }
            } else {
                dispatch(error(actions.update, true));
            }
        } catch (err) {
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

export function fetchFavorites() {
    return async dispatch => {
        dispatch(pending(actions.favorites));
        try {
            const result = await get(actions.favorites.uri);
            dispatch(success(actions.favorites, {result: result}));
        } catch (err) {
            dispatch(error(actions.favorites, err));
        }
    };
}