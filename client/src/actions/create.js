import { CREATE_MONUMENT_PENDING, CREATE_MONUMENT_SUCCESS, CREATE_MONUMENT_ERROR } from "../constants";
import { post } from "../utils/api-util";
import {addError} from "./errors";

function createMonumentPending() {
    return {
        type: CREATE_MONUMENT_PENDING
    };
}

function createMonumentSuccess(monument) {
    return {
        type: CREATE_MONUMENT_SUCCESS,
        payload: monument
    };
}

function createMonumentError(error) {
    return {
        type: CREATE_MONUMENT_ERROR,
        error: error
    };
}

export default function createMonument(monument) {
    return async dispatch => {
        dispatch(createMonumentPending());

        try {
            const createdMonument = await post('/api/monument', monument);
            dispatch(createMonumentSuccess(createdMonument));
        } catch (error) {
            dispatch(createMonumentError(error));
            dispatch(addError({
                message: error.message
            }));
        }
    };
}