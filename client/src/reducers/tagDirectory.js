import { FETCH_TAGS_PENDING, FETCH_TAGS_SUCCESS, FETCH_TAGS_ERROR } from '../constants';

const initialState = {
    fetchTagsPending: false,
    tags: [],
    error: null
};

