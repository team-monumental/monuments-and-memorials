import * as moment from 'moment';

export function prettyPrintDate(date) {
    if (!date) return;
    date = moment(new Date(date));
    // Wednesday, October 16th, 2019 format
    return date.format('dddd, MMMM Do, YYYY');
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