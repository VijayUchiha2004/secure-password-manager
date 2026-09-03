// <!-- <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Secure Pass</title>


   

//     <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
//     <style>
//         body {
//             font-family: "Poppins" sans-serif;
//             background: url('img.jpg') no-repeat;
//             color: #fff;
//             display: flex;
//             flex-direction: column;
//             min-height: 100vh;
//         }
//         .container {
//             flex: 1;
//         }
//         header {
//             text-align: center;
//             color: #fff;
//             margin-bottom: 20px;
            
//             background-color: transparent;
//             padding: 20px 0;
//             text-align: center;
//             border-top: 5px solid #4B4453;
//             color: #e9eef3;
//         }
//         .form-container {
//             max-width: 600px;
//             margin: 0 auto 20px;
//             padding: 20px;
//             background: transparent;
//             box-shadow: 0 0 10px rgba(0,0,0, .1);
//             backdrop-filter: blur(20px);
//             border-radius: 8px;
//             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//         }
//         .toggle-password, .edit-password {
//             cursor: pointer;
//             margin-left: 10px;
//             font-size: 16px;
//             vertical-align: middle;
//             transition: color 0.3s;
//         }
//         .toggle-password:hover, .edit-password:hover {
//             color: #007bff;
//         }
//         #password-count {
//             text-align: center;
//             margin-top: 20px;
//             font-size: 18px;
//             font-weight: bold;
//             color: #fff;
//         }
//         footer {
//             background-color: black;
//             padding: 20px 0;
//             text-align: center;
//             border-top: 5px solid #4B4453;
//             color: #e9eef3;
//         }
//         footer p {
//             margin: 0;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <header>
//             <h1>Secure Pass</h1>
//         </header>
        
//         <div class="form-container">
//             <form id="passwordForm">
//                 <div class="form-group">
//                     <label for="email">Email:</label>
//                     <input type="email" id="email" class="form-control" name="email" required>
//                 </div>
//                 <div class="form-group">
//                     <label for="website">Website:</label>
//                     <input type="text" id="website" class="form-control" name="website" required>
//                 </div>
//                 <div class="form-group">
//                     <label for="username">Username:</label>
//                     <input type="text" id="username" class="form-control" name="username" required>
//                 </div>
//                 <div class="form-group">
//                     <label for="password">Password:</label>
//                     <input type="password" id="password" class="form-control" name="password" required>
//                 </div>
//                 <button type="submit" class="btn btn-primary btn-block">Save Password</button>
//             </form>
//         </div>
//         <div id="alert" class="alert alert-success" style="display: none;">Copied to clipboard!</div>
//         <div class="form-group">
//             <input type="search" id="search" class="form-control" placeholder="Search by website..." onkeyup="searchPasswords()">
//         </div>
//         <table class="table table-striped table-hover">
//             <thead class="thead-dark">
//                 <tr>
//                     <th>Website</th>
//                     <th>Username</th>
//                     <th>Password</th>
//                     <th>Actions</th>
//                 </tr>
//             </thead>
//             <tbody></tbody>
//         </table>
//         <div id="password-count"></div>
//     </div>
//     <footer>
//         <p>Welcome to Password Manager! 
//             This application helps you securely store and manage your passwords for various websites.
//          You can save, edit, and delete passwords, and search through your saved entries. Your data is securely stored and only accessible by you. Keep your passwords safe and easily accessible with Password Manager.</p>
//     </footer>

    


//     <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
//     <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
//     <script>
//         async function togglePasswordVisibility(event) {
//             const target = event.target;
//             const passwordField = target.previousElementSibling;

//             if (passwordField.type === 'password') {
//                 passwordField.type = 'text';
//                 target.textContent = '🙈'; // Use eye icon or emoji
//             } else {
//                 passwordField.type = 'password';
//                 target.textContent = '👁️'; // Use eye icon or emoji
//             }
//         }

//         async function editPassword(website, username, password) {
//             document.getElementById('website').value = website;
//             document.getElementById('username').value = username;
//             document.getElementById('password').value = password;
//             document.querySelector(".btn").textContent = "Update Password";
//         }

//         async function deletePassword(email, website) {
//             const response = await fetch(`http://localhost:3000/passwords?email=${email}&website=${website}`, {
//                 method: 'DELETE'
//             });
//             if (response.ok) {
//                 alert(`Successfully deleted ${website}'s password`);
//                 showPasswords();
//             } else {
//                 alert("Failed to delete password");
//             }
//         }

//         async function showPasswords() {
//             const email = document.getElementById('email').value;
//             let tb = document.querySelector("tbody");
//             const response = await fetch(`http://localhost:3000/passwords?email=${email}`);
//             const data = await response.json();

//             if (data.length === 0) {
//                 tb.innerHTML = "<tr><td colspan='4' class='text-center'>No Data To Show</td></tr>";
//                 document.getElementById('password-count').textContent = "Total Passwords: 0";
//             } else {
//                 tb.innerHTML = "";
//                 let str = "";
//                 for (let element of data) {
//                     str += `<tr>
//                         <td>${element.website}</td>
//                         <td>${element.username}</td>
//                         <td>
//                             <input type="password" value="${element.password}" readonly class="form-control d-inline-block" style="width: auto;">
//                             <span class="toggle-password" onclick="togglePasswordVisibility(event)">👁️</span>
//                         </td>
//                         <td>
//                             <button class="btn btn-danger btn-sm" onclick="deletePassword('${email}', '${element.website}')">Delete</button>
//                             <span class="edit-password" onclick="editPassword('${element.website}', '${element.username}', '${element.password}')">✏️</span>
//                         </td>
//                     </tr>`;
//                 }
//                 tb.innerHTML = str;
//                 document.getElementById('password-count').textContent = `Total Passwords: ${data.length}`;
//             }
//         }

//         function searchPasswords() {
//             const filter = document.getElementById('search').value.toUpperCase();
//             const rows = document.querySelector("tbody").rows;

//             for (let i = 0; i < rows.length; i++) {
//                 const website = rows[i].cells[0].textContent;
//                 if (website.toUpperCase().indexOf(filter) > -1) {
//                     rows[i].style.display = "";
//                 } else {
//                     rows[i].style.display = "none";
//                 }
//             }
//         }

//         document.querySelector(".btn").addEventListener("click", async (e) => {
//             e.preventDefault();
//             const email = document.getElementById("email").value;
//             const website = document.getElementById("website").value;
//             const username = document.getElementById("username").value;
//             const password = document.getElementById("password").value;
//             const button = document.querySelector(".btn");

//             if (button.textContent === "Update Password") {
//                 const response = await fetch('http://localhost:3000/passwords', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({ email, website, username, password })
//                 });

//                 if (response.ok) {
//                     alert("Password Updated");
//                     button.textContent = "Save Password";
//                     showPasswords();
//                 } else {
//                     alert("Failed to update password");
//                     console.error('Failed to update password:', await response.text());
//                 }
//             } else {
//                 const response = await fetch('http://localhost:3000/passwords', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({ email, website, username, password })
//                 });

//                 if (response.ok) {
//                     alert("Password Saved");
//                     showPasswords();
//                 } else {
//                     alert("Failed to save password");
//                     console.error('Failed to save password:', await response.text());
//                 }
//             }
//         });

//         document.addEventListener("DOMContentLoaded", () => {
//             showPasswords();
//         });
//     </script>
// </body>
// </html>  -->



// File: public/js/main.js

// Authentication is handled by the HttpOnly access_token cookie.
const token = null;

// Global variable to store passwords
let allPasswords = [];

// --- UTILITY FUNCTIONS ---
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
}

function updatePasswordStrength(passwordInput, strengthBar) {
    const strength = checkPasswordStrength(passwordInput.value);
    strengthBar.className = 'password-strength';
    if (strength > 0) strengthBar.classList.add(`strength-${strength}`);
}

function togglePasswordVisibility(input, icon) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    icon.classList.toggle('bx-show');
    icon.classList.toggle('bx-hide');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// --- API FUNCTIONS ---
async function fetchWithAuth(url, options = {}) {
    const csrfToken = await getCsrfToken();
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
    headers['X-CSRF-Token'] = csrfToken;
    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(apiUrl(url), { ...options, headers, credentials: 'include' });

    if (response.status === 401 || response.status === 403) {
        // Token is invalid or expired
        window.location.href = '/login.html';
        return null; // Stop execution
    }
    return response;
}

async function loadPasswords() {
    try {
        const response = await fetchWithAuth('/passwords');
        if (!response) return;

        allPasswords = await response.json();
        renderPasswords(allPasswords);
    } catch (error) {
        console.error('Error loading passwords:', error);
    }
}

async function deletePassword(id) {
    if (confirm('Are you sure you want to delete this password?')) {
        try {
            const response = await fetchWithAuth(`/passwords/${id}`, {
                method: 'DELETE'
            });
            if (response && response.ok) {
                loadPasswords(); // Refresh the list
            }
        } catch (error) {
            console.error('Error deleting password:', error);
        }
    }
}

async function generatePassword() {
    const length = document.getElementById('passwordLength').value;
    try {
        const response = await fetch(apiUrl(`/generate-password?length=${length}`));
        const data = await response.json();
        const passwordInput = document.getElementById('password');
        const strengthBar = document.querySelector('.add-password-form .password-strength');
        passwordInput.value = data.password;
        updatePasswordStrength(passwordInput, strengthBar);
    } catch (error) {
        console.error('Error generating password:', error);
    }
}

// --- RENDERING & DOM ---
function renderPasswords(passwords) {
    const passwordsList = document.getElementById('passwordsList');
    passwordsList.innerHTML = ''; // Clear existing list

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    const filteredPasswords = passwords.filter(pwd => {
        const matchesSearch = pwd.website.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || pwd.category === category;
        return matchesSearch && matchesCategory;
    });

    if (filteredPasswords.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.style.cssText = 'color: #666; text-align: center;';
        emptyMessage.textContent = 'No passwords found.';
        passwordsList.appendChild(emptyMessage);
        return;
    }

    filteredPasswords.forEach(pwd => {
        const div = document.createElement('div');
        div.className = 'password-item';

        const info = document.createElement('div');
        info.className = 'password-info';

        const website = document.createElement('strong');
        website.textContent = pwd.website;
        info.appendChild(website);

        const username = document.createElement('p');
        username.textContent = `Username: ${pwd.username}`;
        info.appendChild(username);

        const passwordField = document.createElement('p');
        passwordField.className = 'password-field';
        passwordField.append('Password: ');

        const passwordDots = document.createElement('span');
        passwordDots.className = 'password-dots';
        passwordDots.textContent = '•'.repeat(pwd.password.length);
        passwordField.appendChild(passwordDots);

        const passwordText = document.createElement('span');
        passwordText.className = 'password-text';
        passwordText.style.display = 'none';
        passwordText.textContent = pwd.password;
        passwordField.appendChild(passwordText);

        const copyButton = document.createElement('i');
        copyButton.className = 'bx bx-copy copy-btn';
        passwordField.appendChild(copyButton);

        const toggleButton = document.createElement('i');
        toggleButton.className = 'bx bx-show toggle-view';
        passwordField.appendChild(toggleButton);
        info.appendChild(passwordField);

        const category = document.createElement('p');
        category.textContent = `Category: ${pwd.category || 'Uncategorized'}`;
        info.appendChild(category);

        if (pwd.notes) {
            const notes = document.createElement('p');
            notes.textContent = `Notes: ${pwd.notes}`;
            info.appendChild(notes);
        }

        const updated = document.createElement('p');
        updated.style.cssText = 'font-size: 12px; color: #999;';
        updated.textContent = `Last updated: ${new Date(pwd.updated_at).toLocaleString()}`;
        info.appendChild(updated);
        div.appendChild(info);

        const actions = document.createElement('div');
        actions.className = 'password-actions';
        [
            ['Edit', 'btn-secondary edit-btn'],
            ['History', 'btn-secondary history-btn'],
            ['Delete', 'delete-btn']
        ].forEach(([label, className]) => {
            const button = document.createElement('button');
            button.className = className;
            button.dataset.id = pwd.id;
            button.textContent = label;
            actions.appendChild(button);
        });
        div.appendChild(actions);
        passwordsList.appendChild(div);
    });

    // Add event listeners to new buttons
    attachEventListeners();
}

function attachEventListeners() {
    // Copy
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const passText = e.target.closest('.password-field').querySelector('.password-text').textContent;
            copyToClipboard(passText);
        });
    });

    // Toggle view
    document.querySelectorAll('.toggle-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const field = e.target.closest('.password-field');
            const dotsSpan = field.querySelector('.password-dots');
            const textSpan = field.querySelector('.password-text');
            const isHidden = dotsSpan.style.display !== 'none';
            dotsSpan.style.display = isHidden ? 'none' : 'inline';
            textSpan.style.display = isHidden ? 'inline' : 'none';
            e.target.classList.toggle('bx-show');
            e.target.classList.toggle('bx-hide');
        });
    });

    // Delete
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deletePassword(e.target.dataset.id));
    });

    // Edit
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openEditModal(e.target.dataset.id));
    });

    // History
    document.querySelectorAll('.history-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openHistoryModal(e.target.dataset.id));
    });
}

// --- MODAL LOGIC ---
const editModal = document.getElementById('editModal');
const historyModal = document.getElementById('historyModal');

function openEditModal(id) {
    const pwd = allPasswords.find(p => p.id == id);
    if (!pwd) return;

    document.getElementById('editPasswordId').value = pwd.id;
    document.getElementById('editWebsite').value = pwd.website;
    document.getElementById('editUsername').value = pwd.username;
    document.getElementById('editPassword').value = pwd.password;
    document.getElementById('editCategory').value = pwd.category;
    document.getElementById('editNotes').value = pwd.notes;
    
    const strengthBar = editModal.querySelector('.password-strength');
    updatePasswordStrength(document.getElementById('editPassword'), strengthBar);
    
    editModal.style.display = 'block';
}

async function openHistoryModal(id) {
    const historyList = document.getElementById('historyList');
    historyList.textContent = 'Loading history...';
    historyModal.style.display = 'block';

    try {
        const response = await fetchWithAuth(`/passwords/${id}/history`);
        if (!response) return;

        const history = await response.json();
        
        if (history.length === 0) {
            historyList.textContent = 'No password history found.';
            return;
        }

        historyList.innerHTML = '';
        history.forEach(hist => {
            const li = document.createElement('li');
            const password = document.createElement('p');
            password.textContent = `Password: ${'•'.repeat(hist.password.length)}`;
            const changed = document.createElement('p');
            changed.textContent = `Changed: ${new Date(hist.changed_at).toLocaleString()}`;
            li.append(password, changed);
            historyList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        historyList.textContent = 'Error loading history.';
    }
}

function closeModal() {
    editModal.style.display = 'none';
    historyModal.style.display = 'none';
}

// --- INITIALIZE & EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial password load
    loadPasswords();

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        const csrfToken = await getCsrfToken();
        await fetch(apiUrl('/logout'), {
            method: 'POST',
            credentials: 'include',
            headers: { 'X-CSRF-Token': csrfToken }
        });
        window.location.href = '/login.html';
    });

    // Add Password form
    document.getElementById('addPasswordForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = {
            website: document.getElementById('website').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            category: document.getElementById('category').value,
            notes: document.getElementById('notes').value,
        };

        try {
            const response = await fetchWithAuth('/passwords', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (response && response.ok) {
                this.reset();
                updatePasswordStrength(document.getElementById('password'), document.querySelector('.add-password-form .password-strength'));
                loadPasswords();
            } else if (response) {
                const err = await response.json();
                alert('Error: ' + err.message);
            }
        } catch (error) {
            console.error('Error adding password:', error);
        }
    });

    // Edit Password form
    document.getElementById('editPasswordForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('editPasswordId').value;
        const formData = {
            website: document.getElementById('editWebsite').value,
            username: document.getElementById('editUsername').value,
            password: document.getElementById('editPassword').value,
            category: document.getElementById('editCategory').value,
            notes: document.getElementById('editNotes').value,
        };

        try {
            const response = await fetchWithAuth(`/passwords/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (response && response.ok) {
                closeModal();
                loadPasswords();
            } else {
                alert('Failed to update password.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
        }
    });

    // Search and filter listeners
    document.getElementById('searchInput').addEventListener('input', () => renderPasswords(allPasswords));
    document.getElementById('categoryFilter').addEventListener('change', () => renderPasswords(allPasswords));
    
    // Password generation listener
    document.getElementById('generatePassword').addEventListener('click', generatePassword);

    // Password strength indicator for 'Add' form
    document.getElementById('password').addEventListener('input', (e) => {
        const strengthBar = document.querySelector('.add-password-form .password-strength');
        updatePasswordStrength(e.target, strengthBar);
    });

    // Password strength indicator for 'Edit' form
    document.getElementById('editPassword').addEventListener('input', (e) => {
        const strengthBar = document.querySelector('#editModal .password-strength');
        updatePasswordStrength(e.target, strengthBar);
    });

    // Toggle visibility for 'Add' form
    document.querySelector('.add-password-form .toggle-password').addEventListener('click', (e) => {
        togglePasswordVisibility(document.getElementById('password'), e.target);
    });

    // Toggle visibility for 'Edit' form
    document.querySelector('#editModal .toggle-password').addEventListener('click', (e) => {
        togglePasswordVisibility(document.getElementById('editPassword'), e.target);
    });

    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', closeModal));
    window.addEventListener('click', (e) => {
        if (e.target == editModal || e.target == historyModal) {
            closeModal();
        }
    });
});