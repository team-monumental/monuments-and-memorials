/**
 * Helper function to check if an Object is empty
 * Empty is defined has having none of its own attributes
 * @param object - Object to check for emptiness
 * @returns {boolean} - True if the Object is empty, False otherwise
 */
export function isEmptyObject(object) {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}