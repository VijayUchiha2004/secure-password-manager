const crypto = require('crypto');
const logger = require('../utils/logger');

function requestLogger(req, res, next) {
    const requestId = crypto.randomUUID();
    const startedAt = process.hrtime.bigint();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
        const metadata = {
            requestId,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            durationMs: Math.round(durationMs * 100) / 100
        };
        if (res.statusCode >= 500) {
            logger.error('Request completed', metadata);
        } else if (res.statusCode >= 400) {
            logger.warn('Request completed', metadata);
        } else {
            logger.info('Request completed', metadata);
        }
    });

    next();
}

module.exports = requestLogger;
