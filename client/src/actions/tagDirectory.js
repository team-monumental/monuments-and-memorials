import { FETCH_TAGS_PENDING, FETCH_TAGS_SUCCESS, FETCH_TAGS_ERROR } from '../constants';
import { get } from '../utils/api-util';

function fetchTagsPending() {
    return {
        type: FETCH_TAGS_PENDING
    };
}

function fetchTagsSuccess(tags) {
    return {
        type: FETCH_TAGS_SUCCESS,
        payload: tags
    };
}

function fetchTagsError(error) {
    return {
        type: FETCH_TAGS_ERROR,
        error: error
    };
}

export default function fetchTags() {
    return async dispatch => {
        dispatch(fetchTagsPending());

        try {
            const tags = await get('/api/tags');
            dispatch(fetchTagsSuccess(tags));
        } catch (error) {
            dispatch(fetchTagsError(error));
        }
    };
}