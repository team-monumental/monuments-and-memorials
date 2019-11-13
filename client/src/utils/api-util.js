export async function get(url) {
    let error = null;
    let res = await fetch(url)
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
}