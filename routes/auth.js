// File: routes/auth.js
// Purpose: Handles user registration and login.

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Import the database connection
const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        
        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ success: true, token: accessToken }); 
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;