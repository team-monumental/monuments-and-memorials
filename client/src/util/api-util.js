export async function get(url, queryString) {
    let error = null;
    let res = await fetch(url + queryString)
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
}