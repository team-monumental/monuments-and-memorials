import { SIGNUP_ERROR, SIGNUP_PENDING, SIGNUP_SUCCESS, LOGIN_ERROR, LOGIN_PENDING, LOGIN_SUCCESS, CREATE_SESSION, CLEAR_SESSION } from '../constants';
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
