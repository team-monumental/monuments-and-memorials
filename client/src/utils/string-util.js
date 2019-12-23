import * as moment from 'moment';

export function prettyPrintDate(date) {
    if (!date) return;
    date = moment(new Date(date));
    // Wednesday, October 16th, 2019 format
    return date.format('dddd, MMMM Do, YYYY');
}