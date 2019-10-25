let toastId = 0;
let defaultToastOptions = {
    duration: 5000
};
export function createToast(options) {
    return {
        ...defaultToastOptions,
        ...options,
        id: toastId++
    }
}

let errorId = 0;
let defaultErrorOptions = {
    severity: 'low',
    message: 'Something went wrong.'
};
export function createError(options) {
    console.log('created', {
        ...defaultErrorOptions,
        ...options,
        id: errorId + 1
    });
    return {
        ...defaultErrorOptions,
        ...options,
        id: errorId++
    }
}
