import * as QueryString from 'query-string';

/**
 * Global function for performing monument searches
 * The page will be redirected to the search results page with the proper query params
 * @param changedParams The query params to override the current (if existent) query params with
 * @param history       The react-router history prop must be passed in here so that we can use `.push`
 * @param uri           The uri to redirect to with search params
 */
export default function search(changedParams, history, uri = '/search') {
    const params = {
        ...changedParams
    };
    for (let param in params) {
        // We're explicit with allowing 0 here as it's falsey but we do want it to be included if it's provided
        // Setting null and empty string values to undefined here prevents empty query params like `&q=` showing up
        if (!params[param] && params[param] !== 0) params[param] = undefined;
    }

    // If we're not explicitly changing the page, then reset the page to 1 so that we don't end up in a bad page state
    if (!changedParams.hasOwnProperty('page')) params.page = '1';

    const queryString = QueryString.stringify(params, {arrayFormat: 'comma'});
    uri = `${uri}/?${queryString}`;

    // Check that this isn't a no-op, because this ends up causing the page to lose its search results state
    if (uri !== window.location.pathname + window.location.search) {
        // Navigate to the search results page. The SearchPage component will then automatically search for results
        history.push(uri);
    }
}
