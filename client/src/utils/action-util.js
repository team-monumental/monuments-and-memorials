export function pending(action, progress) {
    return {
        type: action.pending,
        progress
    };
}

export function success(action, payload) {
    if (Array.isArray(payload)) {
        return {
            type: action.success,
            payload
        }
    } else {
        return {
            type: action.success,
            payload: {
                error: null,
                ...payload
            }
        };
    }
}

export function error(action, error) {
    return {
        type: action.error,
        error
    };
}

export function reset(action) {
    return {
        type: action.reset
    };
}
