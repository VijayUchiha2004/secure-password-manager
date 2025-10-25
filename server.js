

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Import routes & middleware
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use API auth routes (for POST /login and POST /register)
app.use(authRoutes);


// --- HTML Page Routes (MOVED UP) ---
// These must come BEFORE the password API routes

// Unprotected routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html'))); // Handle direct request
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'register.html'))); // Handle direct request

// Protected route for the main application page
// app.get('/main', authenticateToken, (req, res) => {
//     res.sendFile(path.join(__dirname, 'main.html'));
// });
// app.get('/main.html', authenticateToken, (req, res) => { // Handle direct request
//     res.sendFile(path.join(__dirname, 'main.html'));
// });

// Protected route for the main application page
// The HTML is served, but the JS inside (main.js) will check for a token.
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});
app.get('/main.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});


// --- API Routes (MOVED DOWN) ---
// Use API password routes *after* specific HTML routes
app.use(passwordRoutes);


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 