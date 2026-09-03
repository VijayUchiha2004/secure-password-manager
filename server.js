

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const csrfMiddleware = require('./middleware/csrfMiddleware');
const requestLogger = require('./middleware/requestLogger');
const logger = require('./utils/logger');
const port = Number.parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || '0.0.0.0';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port.');
}

const requiredEnvironment = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET', 'ENCRYPTION_KEY'];
const missingEnvironment = requiredEnvironment.filter(name => !process.env[name]);
if (missingEnvironment.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvironment.join(', ')}`);
}

const db = require('./db');
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');
const app = express();
app.set('trust proxy', 1);

// Middleware
app.disable('x-powered-by');
app.use(express.json({ limit: '25kb' }));
app.use(cookieParser());
app.use(requestLogger);
app.use(csrfMiddleware);
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.get('X-Forwarded-Proto') !== 'https') {
        return res.redirect(`https://${req.get('host')}${req.originalUrl}`);
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com https://unpkg.com; " +
        "font-src 'self' https://fonts.gstatic.com https://unpkg.com; img-src 'self' data:; connect-src 'self'; " +
        "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
    );
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});
if (process.env.CORS_ORIGIN) {
    app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
}

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use API auth routes (for POST /login and POST /register)
app.use(authRoutes);

app.get('/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        logger.error('Health check failed', { error: error.message });
        res.status(503).json({ status: 'unavailable' });
    }
});


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
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

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

app.use((error, req, res, next) => {
    logger.error('Unhandled application error', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        error: error.message
    });
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const server = app.listen(port, host, () => {
    logger.info('Server listening', { host, port });
});

function shutdown(signal) {
    logger.info('Shutdown requested', { signal });
    server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));