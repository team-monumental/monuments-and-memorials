import * as moment from 'moment';

/**
 * valid date formats.  exact date (yyyy-mm-dd), month-year, year
 * @type {Readonly<{MONTH_YEAR: string, YEAR: string, EXACT_DATE: string}>}
 */
export const DateFormat = Object.freeze({YEAR: 'YEAR', MONTH_YEAR: 'MONTH_YEAR', EXACT_DATE: 'EXACT_DATE'})

/**
 * Format the specified date into a user-friendly string
 * @param date - Date to format into a user-friendly string
 * @param dateFormat describes format to output
 */
export function prettyPrintDate(date, dateFormat=DateFormat.EXACT_DATE) {
    if (!date) return;
    date = new Date(date);
    date = moment(new Date( date.getTime() + Math.abs(date.getTimezoneOffset()*60000)))

    switch (dateFormat) {
        case DateFormat.YEAR:
            // 2019 format
            return date.format('YYYY');
        case DateFormat.MONTH_YEAR:
            // October, 2019 format
            return date.format('MMMM, YYYY');
        default:
            // Wednesday, October 16th, 2019 format
            return date.format('dddd, MMMM Do, YYYY');
    }
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

// https://stackoverflow.com/a/15855457/10044594
export const validUrlRegex =
    RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i);

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
    if (!user) {
        return ''
    }
    return [user.firstName, user.lastName].join(' ');
}