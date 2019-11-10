import * as QueryString from 'query-string';

/**
 * Global function for performing monument searches
 * The page will be redirected to the search results page with the proper query params
 * @param changedParams The query params to override the current (if existent) query params with
 * @param history       The react-router history prop must be passed in here so that we can use `.push`
 */
export default function search(changedParams, history) {
    const params = {
        ...QueryString.parse(history.location.search),
        ...changedParams
    };
    for (let param in params) {
        // We're explicit with allowing 0 here as it's falsey but we do want it to be included if it's provided
        // Setting null and empty string values to undefined here prevents empty query params like `&q=` showing up
        if (!params[param] && params[param] !== 0) params[param] = undefined;
    }
    const queryString = QueryString.stringify(params);
    history.push(`/search/?${queryString}`);
}
