import { FETCH_MONUMENT_PENDING, FETCH_MONUMENT_ERROR, FETCH_MONUMENT_SUCCESS } from '../constants';

function fetchMonumentPending() {
    return {
        type: FETCH_MONUMENT_PENDING
    };
}

function fetchMonumentSuccess(monument) {
    return {
        type: FETCH_MONUMENT_SUCCESS,
        payload: monument
    };
}

function fetchMonumentError(error) {
    return {
        type: FETCH_MONUMENT_ERROR,
        error: error
    };
}

export default function fetchMonument(id) {
    return dispatch => {
        dispatch(fetchMonumentPending());
        fetch(`/api/monument/${id}?cascade=true`)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw res.error;
                }
                dispatch(fetchMonumentSuccess(res));
            })
            .catch(error => {
                dispatch(fetchMonumentError(error));
            });
    }
}
