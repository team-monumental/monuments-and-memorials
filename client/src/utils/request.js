async function request(endpoint) {
    const response = await fetch(endpoint);
    const parsed = await response.json();
    if (parsed.errors) {
        throw(parsed.errors[0]);
    }
    return parsed;
}

export default request;