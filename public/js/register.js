// File: public/js/register.js

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (result.success) {
            alert('Registration successful! You can now log in.');
            window.location.href = '/login'; // Redirect to login page
        } else {
            alert('Registration failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again.');
    }
});