import { SIGNUP_ERROR, SIGNUP_PENDING, SIGNUP_SUCCESS, LOGIN_ERROR, LOGIN_PENDING, LOGIN_SUCCESS } from '../constants';
import { post } from "../utils/api-util";

const actions = {
    signup: {
        pending: SIGNUP_PENDING,
        success: SIGNUP_SUCCESS,
        error: SIGNUP_ERROR,
        uri: '/api/user/signup'
    },
    login: {
        pending: LOGIN_PENDING,
        success: LOGIN_SUCCESS,
        error: LOGIN_ERROR,
        uri: '/api/user/login'
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
    return doAction(actions.signup, user);
}

export function login(user) {
    return doAction(actions.login, user);
}

function doAction(action, user) {
    return async dispatch => {
        dispatch(pending(action));
        try {
            const result = await post(action.uri, user);
            dispatch(success(action, result));
        } catch (err) {
            dispatch(error(action, err));
        }
    };
}