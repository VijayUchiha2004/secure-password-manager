const API_BASE_URL = '';

function apiUrl(path) {
    return `${API_BASE_URL}${path}`;
}

async function getCsrfToken() {
    const response = await fetch(apiUrl('/csrf-token'), { credentials: 'include' });
    if (!response.ok) {
        throw new Error(`Unable to get CSRF token (${response.status})`);
    }
    const data = await response.json();
    return data.csrfToken;
}
