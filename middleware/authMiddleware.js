// File: middleware/authMiddleware.js
// Purpose: Checks for a valid JWT.

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Get the token from the Authorization header (e.g., "Bearer TOKEN")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // No token, unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Invalid token
        }
        
        // Add the user payload (which contains the user's ID) to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = authenticateToken;