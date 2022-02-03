import {
    ABOUT_PAGE_FETCH_CONTRIBUTORS_ERROR,
    ABOUT_PAGE_FETCH_CONTRIBUTORS_PENDING,
    ABOUT_PAGE_FETCH_CONTRIBUTORS_SUCCESS,
    ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_ERROR,
    ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_PENDING,
    ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_SUCCESS
} from '../constants';

const initialState = {
    fetchContributorsPending: false,
    fetchMonumentStatisticsPending: false,
    contributors: [],
    monumentStatistics: {},
    contributorsError: null,
    monumentStatisticsError: null
};

/**
 * Tracks the progress of querying for the statistics to display on the About Page
 */
export default function aboutPage(state = initialState, action) {
    switch (action.type) {
        case ABOUT_PAGE_FETCH_CONTRIBUTORS_PENDING:
            return {
                ...state,
                fetchContributorsPending: true
            };
        case ABOUT_PAGE_FETCH_CONTRIBUTORS_SUCCESS:
            return {
                ...state,
                fetchContributorsPending: false,
                contributors: action.payload
            };
        case ABOUT_PAGE_FETCH_CONTRIBUTORS_ERROR:
            return {
                ...state,
                fetchContributorsPending: false,
                error: action.error
            };
        case ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_PENDING:
            return {
                ...state,
                fetchMonumentStatisticsPending: true
            };
        case ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_SUCCESS:
            return {
                ...state,
                fetchMonumentStatisticsPending: false,
                monumentStatistics: action.payload
            };
        case ABOUT_PAGE_FETCH_MONUMENT_STATISTICS_ERROR:
            return {
                ...state,
                fetchMonumentStatisticsPending: false,
                error: action.error
            };
        default:
            return state;
    }
}