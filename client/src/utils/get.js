/**
 * Wrapper for the fetch api to catch errors and deal with json processing
 */
export default async function get(url) {
    let error = null;
    let res = await fetch(url)
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error || res.errors) throw(error || res.error || res.errors[0]);
    else return res;
}