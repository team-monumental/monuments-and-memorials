import {
    TAG_DIRECTORY_FETCH_TAGS_ERROR,
    TAG_DIRECTORY_FETCH_TAGS_PENDING,
    TAG_DIRECTORY_FETCH_TAGS_SUCCESS
} from '../constants';

const initialState = {
    fetchTagsPending: false,
    tags: [],
    error: null
};

export default function tagDirectoryPage(state = initialState, action) {
    switch (action.type) {
        case TAG_DIRECTORY_FETCH_TAGS_PENDING:
            return {
                ...state,
                fetchTagsPending: true
            };
        case TAG_DIRECTORY_FETCH_TAGS_SUCCESS:
            return {
                ...state,
                fetchTagsPending: false,
                tags: action.payload
            };
        case TAG_DIRECTORY_FETCH_TAGS_ERROR:
            return {
                ...state,
                fetchTagsPending: false,
                error: action.error
            };
        default:
            return state;
    }
}