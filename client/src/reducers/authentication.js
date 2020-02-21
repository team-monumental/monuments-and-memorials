import {
    SIGNUP_ERROR, SIGNUP_PENDING, SIGNUP_SUCCESS,
    LOGIN_ERROR, LOGIN_PENDING, LOGIN_SUCCESS,
    CONFIRM_SIGNUP_PENDING, CONFIRM_SIGNUP_SUCCESS, CONFIRM_SIGNUP_ERROR,
    RESEND_CONFIRMATION_PENDING, RESEND_CONFIRMATION_SUCCESS, RESEND_CONFIRMATION_ERROR,
    CREATE_SESSION, CLEAR_SESSION,
    BEGIN_PASSWORD_RESET_ERROR, BEGIN_PASSWORD_RESET_PENDING, BEGIN_PASSWORD_RESET_SUCCESS,
    FINISH_PASSWORD_RESET_ERROR, FINISH_PASSWORD_RESET_PENDING, FINISH_PASSWORD_RESET_SUCCESS
} from '../constants';
import basicReducer from '../utils/basicReducer';

const signupInitialState = {
    pending: false,
    result: null,
    error: null
};

export function signup(state = signupInitialState, action) {
    return basicReducer(state, action, {
        pending: SIGNUP_PENDING,
        success: SIGNUP_SUCCESS,
        error: SIGNUP_ERROR
    });
}

const loginInitialState = {
    pending: false,
    result: null,
    error: null
};

export function login(state = loginInitialState, action) {
    return basicReducer(state, action, {
        pending: LOGIN_PENDING,
        success: LOGIN_SUCCESS,
        error: LOGIN_ERROR
    });
}

const sessionInitialState = {
    pending: true,
    user: null
};

export function session(state = sessionInitialState, action) {
    switch(action.type) {
        case CREATE_SESSION:
            return {
                ...state,
                ...action.payload
            };
        case CLEAR_SESSION:
            return {
                pending: false,
                user: null
            };
        default:
            return state;
    }
}

const confirmInitialState = {
    pending: false,
    success: null,
    error: null
};

export function confirmSignup(state = confirmInitialState, action) {
    return basicReducer(state, action, {
        pending: CONFIRM_SIGNUP_PENDING,
        success: CONFIRM_SIGNUP_SUCCESS,
        error: CONFIRM_SIGNUP_ERROR
    });
}

const resendInitialState = {
    pending: false,
    success: null,
    error: null
};

export function resendConfirmation(state = resendInitialState, action) {
    return basicReducer(state, action, {
        pending: RESEND_CONFIRMATION_PENDING,
        success: RESEND_CONFIRMATION_SUCCESS,
        error: RESEND_CONFIRMATION_ERROR
    });
}

const resetPasswordInitialState = {
    pending: false,
    success: null,
    error: null
};

export function beginPasswordReset(state = resetPasswordInitialState, action) {
    return basicReducer(state, action, {
        pending: BEGIN_PASSWORD_RESET_PENDING,
        success: BEGIN_PASSWORD_RESET_SUCCESS,
        error: BEGIN_PASSWORD_RESET_ERROR
    });
}

export function finishPasswordReset(state = resetPasswordInitialState, action) {
    return basicReducer(state, action, {
        pending: FINISH_PASSWORD_RESET_PENDING,
        success: FINISH_PASSWORD_RESET_SUCCESS,
        error: FINISH_PASSWORD_RESET_ERROR
    });
}
