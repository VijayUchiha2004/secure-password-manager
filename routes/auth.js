// File: routes/auth.js
// Purpose: Handles user registration and login.

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const db = require('../db'); // Import the database connection
const router = express.Router();
const logger = require('../utils/logger');
const { validateAuthInput } = require('../middleware/validateInput');
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
    path: '/'
};

const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again later.'
    },
    handler: (req, res, next, options) => {
        logger.warn('Authentication rate limit exceeded', {
            ip: req.ip,
            path: req.path
        });
        res.status(options.statusCode).json(options.message);
    }
});

// Registration endpoint
router.post('/register', authRateLimit, validateAuthInput, async (req, res) => {
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
        logger.error('Registration error', { error: error.message });
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login endpoint
router.post('/login', authRateLimit, validateAuthInput, async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            logger.warn('Failed login attempt', { ip: req.ip });
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            logger.warn('Failed login attempt', { ip: req.ip });
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.cookie('access_token', accessToken, cookieOptions);
        res.json({ success: true });
    } catch (error) {
        logger.error('Login error', { error: error.message });
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('access_token', { ...cookieOptions, maxAge: undefined });
    res.json({ success: true });
});

module.exports = router;