import * as slugify from "slugify";

// Taken from https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
export const latitudeDecRegex = /^(\+|-)?(?:90(?:(?:\.0+)?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]+)?))$/;

export const latitudeDegRegex = "";

// Taken from: https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
export const longitudeDecRegex = /^(\+|-)?(?:180(?:(?:\.0+)?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]+)?))$/;

export const longitudeDegRegex = "";

export const csvFileRegex = /.+(\.csv)$/;

export const zipFileRegex = /.+(\.zip)$/;

export function getMonumentSlug(monument) {
    return monument && monument.title ?
        slugify(monument.title, {
            remove: /[^a-zA-Z0-9\s]/g,
        }) :
        '';
}
