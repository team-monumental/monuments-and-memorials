import {
    ABOUT_PAGE_FETCH_CONTRIBUTORS_ERROR,
    ABOUT_PAGE_FETCH_CONTRIBUTORS_PENDING,
    ABOUT_PAGE_FETCH_CONTRIBUTORS_SUCCESS,
    ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_ERROR,
    ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_PENDING,
    ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_SUCCESS
} from '../constants';
import {get} from '../utils/api-util';
import {error, pending, success} from '../utils/action-util';

const actions = {
    contributors: {
        pending: ABOUT_PAGE_FETCH_CONTRIBUTORS_PENDING,
        success: ABOUT_PAGE_FETCH_CONTRIBUTORS_SUCCESS,
        error: ABOUT_PAGE_FETCH_CONTRIBUTORS_ERROR,
        uri: '/api/contributors'
    },
    statistics: {
        pending: ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_PENDING,
        success: ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_SUCCESS,
        error: ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_ERROR,
        uri: '/api/monument/statistics'
    }
};

/**
 * Queries for the statistics to display on the About Page
 * First, queries for a list of all contributors on the site
 * Then, queries for the various statistics related to Monuments
 */
export default function fetchAboutPageStatistics() {
    return async dispatch => {
        dispatch(pending(actions.contributors));
        try {
            const contributors = await get(actions.contributors.uri);
            dispatch(success(actions.contributors, contributors));
        } catch (err) {
            dispatch(error(actions.contributors, err));
        }

        dispatch(pending(actions.statistics));
        try {
            const monumentStatistics = await get(actions.statistics.uri);
            dispatch(success(actions.statistics, monumentStatistics));
        } catch (err) {
            dispatch(error(actions.statistics, err));
        }
    };
}