import { SIGNUP_ERROR, SIGNUP_PENDING, SIGNUP_SUCCESS, LOGIN_ERROR, LOGIN_PENDING, LOGIN_SUCCESS } from '../constants';
import { post } from "../utils/api-util";

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
    }
};

function pending(action) {
    return {
        type: action.pending
    };
}

function success(action, payload) {
    return {
        type: action.success,
        payload: {
            result: payload,
            error: null
        }
    };
}

function error(action, error) {
    return {
        type: action.error,
        error
    };
}

export function signup(user) {
    return async dispatch => {
        dispatch(pending(actions.signup));
        try {
            const result = await post(actions.signup.uri, user);
            dispatch(success(actions.signup, result));
            dispatch(login(user));
        } catch (err) {
            dispatch(error(actions.signup, err));
        }
    };
}

export function login(user) {
    return async dispatch => {
        dispatch(pending(actions.login));
        try {
            const result = await fetch(actions.login.uri, {
                method: 'POST',
                body: new URLSearchParams({username: user.email || user.username, password: user.password}),
                credentials: 'same-origin'
            });
            // TODO: redirect, and make a reducer for the user session
            dispatch(success(actions.login, result));
        } catch (err) {
            dispatch(error(actions.login, err));
        }
    };
}
