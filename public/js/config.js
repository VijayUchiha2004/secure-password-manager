const API_BASE_URL = 'https://secure-mypassword-manager-api.onrender.com';

function apiUrl(path) {
    return `${API_BASE_URL}${path}`;
}

fetch(apiUrl('/health'), { credentials: 'include' }).catch(error => {
    console.error('Unable to reach the API:', error);
});
