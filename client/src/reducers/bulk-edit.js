export const queueListReducer = (state, action) => {
    switch (action.type) {
        case 'enqueue':
            break
        case 'dequeue':
            return state.filter(record => record.id !== action.payload)
        default:
            throw new Error(`Unrecognized action type ${action.type}`)
    }
}