import {
    ABOUT_PAGE_FETCH_CONTRIBUTORS_PENDING, ABOUT_PAGE_FETCH_CONTRIBUTORS_SUCCESS,
    ABOUT_PAGE_FETCH_CONTRIBUTORS_ERROR, ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_PENDING,
    ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_SUCCESS, ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_ERROR
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

function fetchMonumentStatisticsPending() {
    return {
        type: ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_PENDING
    };
}

function fetchMonumentStatisticsSuccess(statistics) {
    return {
        type: ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_SUCCESS,
        payload: statistics
    };
}

function fetchMonumentStatisticsError(error) {
    return {
        type: ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_ERROR,
        error: error
    };
}

/**
 * Queries for the statistics to display on the About Page
 * First, queries for a list of all contributors on the site
 * Then, queries for the various statistics related to Monuments
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

        dispatch(fetchMonumentStatisticsPending());
        try {
            const monumentStatistics = await get('/api/monument/statistics');
            dispatch(fetchMonumentStatisticsSuccess(monumentStatistics));
        } catch (error) {
            dispatch(fetchMonumentStatisticsError(error));
        }
    };
}