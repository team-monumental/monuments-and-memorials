import { FETCH_TAGS_PENDING, FETCH_TAGS_SUCCESS, FETCH_TAGS_ERROR } from '../constants';

const initialState = {
    fetchTagsPending: false,
    tags: [],
    error: null
};

export default function tagDirectoryPage(state = initialState, action) {
    switch (action.type) {
        case FETCH_TAGS_PENDING:
            return {
                ...state,
                fetchTagsPending: true
            };
        case FETCH_TAGS_SUCCESS:
            return {
                ...state,
                fetchTagsPending: false,
                tags: action.payload
            };
        case FETCH_TAGS_ERROR:
            return {
                ...state,
                fetchTagsPending: false,
                error: action.error
            };
        default:
            return state;
    }
}