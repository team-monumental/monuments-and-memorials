// Taken from https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
export const latitudeRegex = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;

// Taken from: https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
export const longitudeRegex = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;