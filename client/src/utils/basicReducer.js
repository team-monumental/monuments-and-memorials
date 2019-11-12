/**
 * This is the basic reducer skeleton, which is extracted to this util function to reduce repeated code
 * This relies on: successful data being passed in as `action.payload`, there being pending/success/error states,
 * and there being no other changes necessary within these state handlers
 */
export default function basicReducer(state, action, constants) {
    switch (action.type) {
        case constants.pending:
            return {
                ...state,
                pending: true
            };
        case constants.success:
            return {
                ...state,
                pending: false,
                ...action.payload
            };
        case constants.error:
            return {
                ...state,
                pending: false,
                error: action.error
            };
        default:
            return state;
    }
}