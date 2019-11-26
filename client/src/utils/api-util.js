export async function get(url) {
    let error = null;
    let res = await fetch(url)
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
}

export async function post(url, data) {
    let error = null;
    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
}