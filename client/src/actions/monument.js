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
    return async dispatch => {
        dispatch(fetchMonumentPending());
        let error = null;
        const res = await fetch(`/api/monument/${id}?cascade=true`)
            .then(res => res.json())
            .catch(err => error = err);

        if (error || res.error) dispatch(fetchMonumentError(error || res.error));
        else dispatch(fetchMonumentSuccess(res));
    }
}
