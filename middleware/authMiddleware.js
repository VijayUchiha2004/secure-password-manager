// File: middleware/authMiddleware.js
// Purpose: Checks for a valid JWT.

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const cookies = (req.headers.cookie || '').split(';').reduce((values, cookie) => {
        const separator = cookie.indexOf('=');
        if (separator > 0) {
            values[cookie.slice(0, separator).trim()] = decodeURIComponent(cookie.slice(separator + 1));
        }
        return values;
    }, {});
    const authHeader = req.headers['authorization'];
    const token = cookies.access_token || (authHeader && authHeader.split(' ')[1]);

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
