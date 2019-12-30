package com.monumental.util.string;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Class that provides helper methods for String processing
 */
public class StringHelper {

    // Constant for the regex for a valid latitude String
    // Taken from https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
    public static final String latitudeRegex = "^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$";

    // Constant for the regex for a valid longitude String
    // Taken from https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
    public static final String longitudeRegex = "^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$";

    /**
     * Method to determine if a specified String is null or empty
     * @param string - String to check for null or empty
     * @return boolean - True if the String is null or empty, false otherwise
     */
    public static boolean isNullOrEmpty(String string) {
        if (string == null) {
            return true;
        }
        return string.isEmpty();
    }

    /**
     * Method to remove beginning and ending quotes from a specified string
     * Does nothing if there are not both beginning and ending quotes
     * @param string - the String to remove the quotes from
     * @return String - the updated String, with removed quotes if applicable
     */
    public static String removeBeginningAndEndingQuotes(String string) {
        if (string == null) {
            return null;
        }

        // If the string begins and ends with quotes, remove them
        if (string.startsWith("\"") && string.endsWith("\"")) {
            string = string.substring(1, (string.length() - 1));
        }

        return string;
    }

    /**
     * Parse a String into a Date object or null
     */
    public static Date parseNullableDate(String value) {
        if (isNullOrEmpty(value)) return null;
        else {
            try {
                return new SimpleDateFormat("YYYY-MM-DD").parse(value);
            } catch (ParseException e) {
                return null;
            }
        }
    }

    /**
     * Method to parse a state abbreviation or full name into a common format
     * @param state - State String to parse into common format
     * @return String - The name of the State in a common format
     */
    public static String parseState(String state) {
        if (state == null) {
            return null;
        }

        switch (state.toLowerCase()) {
            case "al":
            case "alabama":
                return "Alabama";
            case "ak":
            case "alaska":
                return "Alaska";
            case "az":
            case "arizona":
                return "Arizona";
            case "ar":
            case "arkansas":
                return "Arkansas";
            case "ca":
            case "california":
                return "California";
            case "co":
            case "colorado":
                return "Colorado";
            case "ct":
            case "connecticut":
                return "Connecticut";
            case "de":
            case "delaware":
                return "Delaware";
            case "fl":
            case "florida":
                return "Florida";
            case "ga":
            case "georgia":
                return "Georgia";
            case "hi":
            case "hawaii":
                return "Hawaii";
            case "id":
            case "idaho":
                return "Idaho";
            case "il":
            case "illinois":
                return "Illinois";
            case "in":
            case "indiana":
                return "Indiana";
            case "ia":
            case "iowa":
                return "Iowa";
            case "ks":
            case "kansas":
                return "Kansas";
            case "ky":
            case "kentucky":
                return "Kentucky";
            case "la":
            case "louisiana":
                return "Louisiana";
            case "me":
            case "maine":
                return "Maine";
            case "md":
            case "maryland":
                return "Maryland";
            case "ma":
            case "massachusetts":
                return "Massachusetts";
            case "mi":
            case "michigan":
                return "Michigan";
            case "mn":
            case "minnesota":
                return "Minnesota";
            case "ms":
            case "mississippi":
                return "Mississippi";
            case "mo":
            case "missouri":
                return "Missouri";
            case "mt":
            case "montana":
                return "Montana";
            case "ne":
            case "nebraska":
                return "Nebraska";
            case "nv":
            case "nevada":
                return "Nevada";
            case "nh":
            case "new hampshire":
                return "New Hampshire";
            case "nj":
            case "new jersey":
                return "New Jersey";
            case "nm":
            case "new mexico":
                return "New Mexico";
            case "ny":
            case "new york":
                return "New York";
            case "nc":
            case "north carolina":
                return "North Carolina";
            case "nd":
            case "north dakota":
                return "North Dakota";
            case "oh":
            case "ohio":
                return "Ohio";
            case "ok":
            case "oklahoma":
                return "Oklahoma";
            case "or":
            case "oregon":
                return "Oregon";
            case "pa":
            case "pennsylvania":
                return "Pennsylvania";
            case "ri":
            case "rhode island":
                return "Rhode Island";
            case "sc":
            case "south carolina":
                return "South Carolina";
            case "sd":
            case "south dakota":
                return "South Dakota";
            case "tn":
            case "tennessee":
                return "Tennessee";
            case "tx":
            case "texas":
                return "Texas";
            case "ut":
            case "utah":
                return "Utah";
            case "vt":
            case "vermont":
                return "Vermont";
            case "va":
            case "virginia":
                return "Virginia";
            case "wa":
            case "washington":
                return "Washington";
            case "wv":
            case "west virginia":
                return "West Virginia";
            case "wi":
            case "wisconsin":
                return "Wisconsin";
            case "wy":
            case "wyoming":
                return "Wyoming";
            case "as":
            case "american samoa":
                return "American Samoa";
            case "dc":
            case "district of columbia":
                return "District of Columbia";
            case "fm":
            case "federated states of micronesia":
                return "Federated States of Micronesia";
            case "gu":
            case "guam":
                return "Guam";
            case "mh":
            case "marshall islands":
                return "Marshall Islands";
            case "mp":
            case "northern mariana islands":
                return "Northern Mariana Islands";
            case "pw":
            case "palau":
                return "Palau";
            case "pr":
            case "puerto rico":
                return "Puerto Rico";
            case "vi":
            case "virgin islands":
                return "Virgin Islands";
            default:
                return null;
        }
    }
}
