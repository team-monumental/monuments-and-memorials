import { FETCH_DUPLICATES_PENDING, FETCH_DUPLICATES_SUCCESS, FETCH_DUPLICATES_ERROR } from '../constants';
import { get } from '../utils/api-util';
import * as QueryString from 'query-string';
import { addError } from './errors';

function fetchDuplicatesPending() {
    return {
        type: FETCH_DUPLICATES_PENDING
    };
}

function fetchDuplicatesSuccess(duplicates) {
    return {
        type: FETCH_DUPLICATES_SUCCESS,
        payload: duplicates
    };
}

function fetchDuplicatesError(error) {
    return {
        type: FETCH_DUPLICATES_ERROR,
        error: error
    };
}

export default function fetchDuplicates(title, latitude, longitude, address) {
    return async dispatch => {
        dispatch(fetchDuplicatesPending());

        try {
            const queryString = QueryString.stringify({
                title: title,
                lat: latitude,
                lon: longitude,
                address: address
            });

            const duplicates = await get(`/api/search/duplicates/?${queryString}`);
            dispatch(fetchDuplicatesSuccess(duplicates));
        } catch (error) {
            dispatch(fetchDuplicatesError(error));
            dispatch(addError({
                message: error.message
            }));
        }
    };
}