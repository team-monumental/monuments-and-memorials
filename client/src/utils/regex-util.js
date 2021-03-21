import * as slugify from "slugify";

// Taken from https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
export const latitudeDecRegex = /^(\+|-)?(?:90(?:(?:\.0+)?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]+)?))$/;

// Modified from https://gist.github.com/pjobson/8f44ea79d1852900457bc257a4c9fcd5
export const latitudeDegRegex = /^[+-]?(([0-8]?\d)°+([0-5]?\d|60)'+([0-5]?\d|60)(\.\d+)?|90\D+0\D+0)"+[NSns]?$/;

// Taken from: https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
export const longitudeDecRegex = /^(\+|-)?(?:180(?:(?:\.0+)?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]+)?))$/;

// Modified from: https://gist.github.com/pjobson/8f44ea79d1852900457bc257a4c9fcd5
export const longitudeDegRegex = /^[+-]?([1-7]?\d{1,2}°+([0-5]?\d|60)'+([0-5]?\d|60)(\.\d+)?|180\D+0\D+0)"+[EWew]?$/;

export const csvFileRegex = /.+(\.csv)$/;

export const zipFileRegex = /.+(\.zip)$/;

export function getMonumentSlug(monument) {
    return monument && monument.title ?
        slugify(monument.title, {
            remove: /[^a-zA-Z0-9\s]/g,
        }) :
        '';
}

/**
 * url must start with http or https, may optionally include www, and end with validate suffix (.com, etc.)
 * @param url string to be tested
 * @returns {boolean} true if url, else false
 */
export function validateUrl(url) {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/.test(url)
}
