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

/**
 * copies an object and returns the copy
 * @param obj object to copy
 */
export function copyObject(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    const copy = obj.constructor();
    for (const attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}