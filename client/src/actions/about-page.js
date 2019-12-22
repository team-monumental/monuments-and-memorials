import {
    ABOUT_PAGE_FETCH_CONTRIBUTORS_PENDING, ABOUT_PAGE_FETCH_CONTRIBUTORS_SUCCESS,
    ABOUT_PAGE_FETCH_CONTRIBUTORS_ERROR
} from '../constants';
import { get } from '../utils/api-util';

function fetchContributorsPending() {
    return {
        type: ABOUT_PAGE_FETCH_CONTRIBUTORS_PENDING
    };
}

function fetchContributorsSuccess(contributors) {
    return {
        type: ABOUT_PAGE_FETCH_CONTRIBUTORS_SUCCESS,
        payload: contributors
    };
}

function fetchContributorsError(error) {
    return {
        type: ABOUT_PAGE_FETCH_CONTRIBUTORS_ERROR,
        error: error
    };
}

/**
 * Queries for the statistics to display on the About Page
 * First, queries for a list of all contributors on the site
 */
export default function fetchAboutPageStatistics() {
    return async dispatch => {
        dispatch(fetchContributorsPending());

        try {
            const contributors = await get('/api/contributors');
            dispatch(fetchContributorsSuccess(contributors));
        } catch (error) {
            dispatch(fetchContributorsError(error));
        }
    };
}