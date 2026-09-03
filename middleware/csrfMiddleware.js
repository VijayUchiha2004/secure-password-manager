const crypto = require('crypto');
const logger = require('../utils/logger');
require('dotenv').config();

const csrfCookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.CORS_ORIGIN ? 'none' : 'strict',
    maxAge: 60 * 60 * 1000,
    path: '/'
};

function csrfMiddleware(req, res, next) {
    const timestamp = Math.floor(Date.now() / 1000);
    const csrfToken = `${timestamp}.${crypto
        .createHmac('sha256', process.env.JWT_SECRET)
        .update(String(timestamp))
        .digest('hex')}`;
    req.csrfToken = csrfToken;
    res.cookie('csrf_token', csrfToken, csrfCookieOptions);

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const csrfHeader = req.get('X-CSRF-Token');
        const [timestampValue, signature] = csrfHeader ? csrfHeader.split('.') : [];
        const expectedSignature = timestampValue
            ? crypto.createHmac('sha256', process.env.JWT_SECRET)
                .update(timestampValue)
                .digest('hex')
            : '';
        const tokenAge = Number.parseInt(timestampValue, 10);
        const validToken = Number.isInteger(tokenAge)
            && Math.abs(Math.floor(Date.now() / 1000) - tokenAge) <= 3600
            && signature
            && signature.length === expectedSignature.length
            && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
        if (!validToken) {
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
