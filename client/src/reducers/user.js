import {
    UPDATE_EMAIL_ERROR, UPDATE_EMAIL_PENDING, UPDATE_EMAIL_SUCCESS,
    UPDATE_USER_ERROR, UPDATE_USER_PENDING, UPDATE_USER_SUCCESS, UPDATE_USER_RESET
} from '../constants';
import basicReducer from '../utils/basic-reducer';

const initialState = {
    pending: false,
    result: null,
    error: null
};

export function updateUser(state = initialState, action) {
    return basicReducer(state, action, {
        pending: UPDATE_USER_PENDING,
        success: UPDATE_USER_SUCCESS,
        error: UPDATE_USER_ERROR,
        reset: UPDATE_USER_RESET
    });
}

export function confirmEmailChange(state = initialState, action) {
    return basicReducer(state, action, {
        pending: UPDATE_EMAIL_PENDING,
        success: UPDATE_EMAIL_SUCCESS,
        error: UPDATE_EMAIL_ERROR,
    });
}