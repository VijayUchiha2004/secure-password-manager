// File: routes/passwords.js
// Purpose: Handles all password-related API logic.

const express = require('express');
const db = require('../db');
const { encrypt, decrypt } = require('../utils/crypto');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// --- UPDATED SECTION ---
// --- Place UNPROTECTED utility routes at the top ---

// Generate password
router.get('/generate-password', (req, res) => {
    const length = parseInt(req.query.length) || 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    res.json({ password });
});

// Check password strength
router.post('/check-password-strength', (req, res) => {
    const { password } = req.body;
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push("Password should be at least 8 characters long");

    if (password.match(/[a-z]/)) strength++;
    else feedback.push("Add lowercase letters");

    if (password.match(/[A-Z]/)) strength++;
    else feedback.push("Add uppercase letters");

    if (password.match(/[0-9]/)) strength++;
    else feedback.push("Add numbers");

    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    else feedback.push("Add special characters");

    res.json({
        strength: Math.max(0, strength),
        feedback,
        score: strength * 20 
    });
});


// --- PROTECTED ROUTES ---
// All routes defined *after* this middleware will be protected
router.use(authenticateToken);

// GET /passwords - Get all passwords for the user
router.get('/passwords', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM passwords WHERE user_id = ?', [req.user.id]);
        
        const decryptedResults = results.map(pwd => {
            const decryptedPassword = decrypt({ iv: pwd.iv, encryptedData: pwd.password });
            return { ...pwd, password: decryptedPassword };
        });
        res.json(decryptedResults);
    } catch (err) {
        console.error('Failed to fetch passwords:', err);
        res.status(500).send('Failed to fetch passwords');
    }
});

// POST /passwords - Add a new password
router.post('/passwords', async (req, res) => {
    const userId = req.user.id;
    const { website, username, password, category, notes } = req.body; 
    
    try {
        const encryptedPassword = encrypt(password);

        await db.query(
            'INSERT INTO passwords (user_id, website, username, password, iv, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, website, username, encryptedPassword.encryptedData, encryptedPassword.iv, category, notes]
        );
        res.status(201).json({ success: true });
    } catch (err) {
        console.error('Failed to save password:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'This entry (website + username) already exists.' });
        }
        res.status(500).send('Failed to save password');
    }
});

// PUT /passwords/:id - Update an existing password
router.put('/passwords/:id', async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { website, username, password, category, notes } = req.body;

    try {
        // 1. Get the current password to save to history
        const [oldPasswords] = await db.query(
            'SELECT * FROM passwords WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        
        if (oldPasswords.length === 0) {
            return res.status(404).send('Password not found or you do not have permission.');
        }
        const oldPwd = oldPasswords[0];

        // 2. Save old password to history
        await db.query(
            'INSERT INTO password_history (password_id, user_id, password, iv) VALUES (?, ?, ?, ?)',
            [oldPwd.id, oldPwd.user_id, oldPwd.password, oldPwd.iv]
        );

        // 3. Encrypt the new password
        const newEncrypted = encrypt(password);

        // 4. Update the password entry
        await db.query(
            'UPDATE passwords SET website = ?, username = ?, password = ?, iv = ?, category = ?, notes = ? WHERE id = ?',
            [website, username, newEncrypted.encryptedData, newEncrypted.iv, category, notes, id]
        );
        
        res.json({ success: true });
    } catch (err) {
        console.error('Failed to update password:', err);
        res.status(500).send('Failed to update password');
    }
});

// DELETE /passwords/:id - Delete a password
router.delete('/passwords/:id', async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM passwords WHERE id = ? AND user_id = ?', [id, userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).send('Password not found or you do not have permission.');
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Failed to delete password:', err);
        res.status(500).send('Failed to delete password');
    }
});

// GET /passwords/:id/history - Get history for one password
router.get('/passwords/:id/history', async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        // Check if the user owns the main password entry
        const [ownerCheck] = await db.query('SELECT 1 FROM passwords WHERE id = ? AND user_id = ?', [id, userId]);
        if (ownerCheck.length === 0) {
             return res.status(404).send('Password not found or you do not have permission.');
        }

        // Fetch history
        const [history] = await db.query(
            'SELECT * FROM password_history WHERE password_id = ? AND user_id = ? ORDER BY changed_at DESC',
            [id, userId]
        );
        
        const decryptedHistory = history.map(hist => {
            const decryptedPassword = decrypt({ iv: hist.iv, encryptedData: hist.password });
            return { ...hist, password: decryptedPassword };
        });

        res.json(decryptedHistory);
    } catch (err) {
        console.error('Failed to fetch password history:', err);
        res.status(500).send('Failed to fetch password history');
    }
});

module.exports = router;