import {
    TAG_DIRECTORY_FETCH_TAGS_PENDING, TAG_DIRECTORY_FETCH_TAGS_SUCCESS, TAG_DIRECTORY_FETCH_TAGS_ERROR
} from '../constants';
import { get } from '../utils/api-util';
import { pending, success, error } from '../utils/action-util';

const actions = {
    fetch: {
        pending: TAG_DIRECTORY_FETCH_TAGS_PENDING,
        success: TAG_DIRECTORY_FETCH_TAGS_SUCCESS,
        error: TAG_DIRECTORY_FETCH_TAGS_ERROR,
        uri: '/api/tags'
    }
};

export default function fetchTags() {
    return async dispatch => {
        dispatch(pending(actions.fetch));
        try {
            const tags = await get(actions.fetch.uri);
            dispatch(success(actions.fetch, tags));
        } catch (err) {
            dispatch(error(actions.fetch, err));
        }
    };
}