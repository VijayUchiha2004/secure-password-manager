const crypto = require('crypto');
const logger = require('../utils/logger');

const csrfCookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
    path: '/'
};

function csrfMiddleware(req, res, next) {
    if (!req.cookies.csrf_token) {
        res.cookie('csrf_token', crypto.randomBytes(32).toString('hex'), csrfCookieOptions);
    }

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const csrfCookie = req.cookies.csrf_token;
        const csrfHeader = req.get('X-CSRF-Token');
        if (!csrfCookie || !csrfHeader || csrfCookie.length !== csrfHeader.length ||
            !crypto.timingSafeEqual(Buffer.from(csrfCookie), Buffer.from(csrfHeader))) {
            logger.warn('CSRF validation failed', {
                ip: req.ip,
                method: req.method,
                path: req.path
            });
            return res.status(403).json({ success: false, message: 'Invalid CSRF token.' });
        }
    }

    next();
}

module.exports = csrfMiddleware;
