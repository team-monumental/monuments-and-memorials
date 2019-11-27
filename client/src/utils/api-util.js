/**
 * Send a GET request to the specified url
 * @param url - URL to send the GET to
 */
export async function get(url) {
    let error = null;
    let res = await fetch(url)
        .then(res => res.json())
        .catch(err => error = err);
    if (error || res.error) throw(error || res.error);
    else return res;
}

/**
 * Send a POST request to the specified url with the specified data
 * @param url - URL to send the POST to
 * @param data - JSON data to send to the specified URL
 */
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