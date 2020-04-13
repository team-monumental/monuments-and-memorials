import * as moment from 'moment';

/**
 * Format the specified date into a user-friendly string
 * @param date - Date to format into a user-friendly string
 */
export function prettyPrintDate(date) {
    if (!date) return;
    date = moment(new Date(date));
    // Wednesday, October 16th, 2019 format
    return date.format('dddd, MMMM Do, YYYY');
}

/**
 * Parse the specified dateString into a consistent, user-friendly format
 * @param dateString - String to parse into a consistent, user-friendly format
 */
export function prettyPrintDateString(dateString) {
    if (!dateString) return;

    // Wednesday, October 16th, 2019 format
    return moment(dateString, "YYYY-MM-DD").format('dddd, MMMM Do, YYYY');
}

export const validEmailRegex =
    RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);

/**
 * Return the name of the month for the specified month string (0-based)
 * For example, "00" will return "January" and "11" will return "December"
 * @param month - 0-based string for the month to pretty print
 */
export function prettyPrintMonth(month) {
    if (!month) {
        return;
    }

    return moment().month(month).format("MMMM");
}

export function capitalize(string) {
    return string.split(' ')
        .map(word => word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
        .join(' ');
}

export function getUserFullName(user) {
    return [user.firstName, user.lastName].join(' ');
}