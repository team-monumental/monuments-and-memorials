import {
    SIGNUP_ERROR, SIGNUP_PENDING, SIGNUP_SUCCESS,
    LOGIN_ERROR, LOGIN_PENDING, LOGIN_SUCCESS,
    CONFIRM_SIGNUP_ERROR, CONFIRM_SIGNUP_PENDING, CONFIRM_SIGNUP_SUCCESS,
    RESEND_CONFIRMATION_ERROR, RESEND_CONFIRMATION_PENDING, RESEND_CONFIRMATION_SUCCESS,
    CREATE_SESSION, CLEAR_SESSION,
    BEGIN_PASSWORD_RESET_ERROR, BEGIN_PASSWORD_RESET_PENDING, BEGIN_PASSWORD_RESET_SUCCESS,
    FINISH_PASSWORD_RESET_ERROR, FINISH_PASSWORD_RESET_PENDING, FINISH_PASSWORD_RESET_SUCCESS
} from '../constants';
import { post } from '../utils/api-util';
import { pending, success, error } from '../utils/action-util';

const actions = {
    signup: {
        pending: SIGNUP_PENDING,
        success: SIGNUP_SUCCESS,
        error: SIGNUP_ERROR,
        uri: '/api/signup'
    },
    login: {
        pending: LOGIN_PENDING,
        success: LOGIN_SUCCESS,
        error: LOGIN_ERROR,
        uri: '/api/login'
    },
    confirm: {
        pending: CONFIRM_SIGNUP_PENDING,
        success: CONFIRM_SIGNUP_SUCCESS,
        error: CONFIRM_SIGNUP_ERROR,
        uri: '/api/signup/confirm'
    },
    resend: {
        pending: RESEND_CONFIRMATION_PENDING,
        success: RESEND_CONFIRMATION_SUCCESS,
        error: RESEND_CONFIRMATION_ERROR,
        uri: '/api/signup/confirm/resend'
    },
    beginPasswordReset: {
        pending: BEGIN_PASSWORD_RESET_PENDING,
        success: BEGIN_PASSWORD_RESET_SUCCESS,
        error: BEGIN_PASSWORD_RESET_ERROR,
        uri: '/api/reset-password'
    },
    finishPasswordReset: {
        pending: FINISH_PASSWORD_RESET_PENDING,
        success: FINISH_PASSWORD_RESET_SUCCESS,
        error: FINISH_PASSWORD_RESET_ERROR,
        uri: '/api/reset-password/confirm'
    }
};

export function signup(user) {
    return async dispatch => {
        dispatch(pending(actions.signup));
        try {
            const result = await post(actions.signup.uri, user);
            dispatch(success(actions.signup, {result: result}));
            dispatch(login(user));
        } catch (err) {
            dispatch(error(actions.signup, err));
        }
    };
}

export function login(user, callback) {
    return async dispatch => {
        dispatch(pending(actions.login));
        try {
            const result = await fetch(actions.login.uri, {
                method: 'POST',
                body: new URLSearchParams({username: user.email || user.username, password: user.password}),
                credentials: 'include'
            });
            if (!result.ok) {
                return dispatch(error(actions.login, await result.json()));
            }
            dispatch(getUserSession(callback));
            dispatch(success(actions.login, {result: result}));
        } catch (err) {
            dispatch(error(actions.login, err));
        }
    };
}

export function createUserSession(user) {
    return {
        type: CREATE_SESSION,
        payload: {
            pending: false,
            user
        }
    };
}

export function clearUserSession() {
    return {
        type: CLEAR_SESSION
    };
}

export function getUserSession(callback) {
    return async dispatch => {
        const res = await fetch('/api/session')
            .then((res) => res.text())
            .then((text) => text.length ? JSON.parse(text) : null)
            .catch((error) => {
                return dispatch(createUserSession(null));
            });
        if (!res || res.ok) {
            // User is not authenticated
            return dispatch(createUserSession(null));
        }
        dispatch(createUserSession(await res));
        if (callback && typeof callback === 'function') callback();
    }
}

export function logout(callback) {
    return async dispatch => {
        const res = await fetch('/api/logout');
        if (!res.ok) {
            // Failed to logout, may need to handle this in the future
            return;
        }
        dispatch(clearUserSession());
    }
}

export function confirmSignup(token) {
    return async dispatch => {
        dispatch(pending(actions.confirm));
        try {
            const result = await post(actions.confirm.uri + '?token=' + token);
            if (result.success) {
                dispatch(success(actions.confirm, {success: true}));
            } else {
                dispatch(error(actions.confirm, true));
            }
        } catch (err) {
            dispatch(error(actions.confirm, err.message));
        }
    };
}

export function resendConfirmation(user, signup) {
    return async dispatch => {
        dispatch(pending(actions.resend));
        try {
            const result = await post(actions.resend.uri + '?signup=' + signup, user);
            if (result.success) {
                dispatch(success(actions.resend, {success: true}));
            } else {
                dispatch(error(actions.resend, true));
            }
        } catch (err) {
            dispatch(error(actions.resend, err.message));
        }
    }
}

export function beginPasswordReset(email) {
    return async dispatch => {
        dispatch(pending(actions.beginPasswordReset));
        try {
            const result = await post(actions.beginPasswordReset.uri + '?email=' + email);
            dispatch(success(actions.beginPasswordReset, result));
        } catch (err) {
            dispatch(error(actions.beginPasswordReset, err.message));
        }
    }
}

export function finishPasswordReset(data) {
    return async dispatch => {
        dispatch(pending(actions.finishPasswordReset));
        try {
            const result = await post(actions.finishPasswordReset.uri, data);
            if (result.success) {
                dispatch(success(actions.finishPasswordReset, result));
                dispatch(login({email: result.email, password: data.newPassword}));
            } else {
                dispatch(error(actions.finishPasswordReset, true));
            }
        } catch (err) {
            dispatch(error(actions.finishPasswordReset, err.message));
        }
    }
}
