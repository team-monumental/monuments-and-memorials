// These factories are used to create payloads for the associated redux actions

let toastId = 0;

export function createToast(options) {
    options.duration = options.duration || 5000;
    return {
        ...options,
        id: toastId++
    }
}

let errorId = 0;

export function createError({message = 'Something went wrong.'}) {
    return {
        message,
        id: errorId++
    }
}
