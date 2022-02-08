import {FETCH_DUPLICATES_ERROR, FETCH_DUPLICATES_PENDING, FETCH_DUPLICATES_SUCCESS} from '../constants';
import {get} from '../utils/api-util';
import * as QueryString from 'query-string';
import {error, pending, success} from '../utils/action-util';

const actions = {
    duplicates: {
        pending: FETCH_DUPLICATES_PENDING,
        success: FETCH_DUPLICATES_SUCCESS,
        error: FETCH_DUPLICATES_ERROR,
    }
};

/**
 * Queries for any duplicate Monuments based on the specified Monument attributes
 * @param title - Monument title to use when searching for duplicates
 * @param latitude - Monument latitude to use when searching for duplicates
 * @param longitude - Monument longitude to use when searching for duplicates
 * @param address - Monument address to use when searching for duplicates
 */
export default function fetchDuplicates(title, latitude, longitude, address) {
    return async dispatch => {
        dispatch(pending(actions.duplicates));

        try {
            const queryString = QueryString.stringify({
                title: title,
                lat: latitude,
                lon: longitude,
                address: address
            });

            const duplicates = await get(`/api/search/duplicates/?${queryString}`);
            dispatch(success(actions.duplicates, duplicates));
        } catch (err) {
            dispatch(error(actions.duplicates, err));
        }
    };
}