function validateAuthInput(req, res, next) {
    const { username, password } = req.body || {};
    if (!isString(username) || username.trim().length < 3 || username.length > 255 ||
        !isString(password) || password.length < 8 || password.length > 1024) {
        return res.status(400).json({
            success: false,
            message: 'Username must be 3-255 characters and password must be 8-1024 characters.'
        });
    }
    next();
}

function validatePasswordInput(req, res, next) {
    const { website, username, password, category, notes } = req.body || {};
    const categories = ['social', 'email', 'banking', 'other'];
    if (!isString(website) || website.trim().length === 0 || website.length > 255 ||
        !isString(username) || username.trim().length === 0 || username.length > 255 ||
        !isString(password) || password.length === 0 || password.length > 1024 ||
        !isString(category) || !categories.includes(category) ||
        (notes !== undefined && notes !== null && (!isString(notes) || notes.length > 5000))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid password entry. Check field lengths and category.'
        });
    }
    next();
}

function validatePasswordId(req, res, next) {
    if (!/^\d+$/.test(req.params.id) || Number(req.params.id) < 1) {
        return res.status(400).json({ success: false, message: 'Invalid password ID.' });
    }
    next();
}

function isString(value) {
    return typeof value === 'string';
}

module.exports = { validateAuthInput, validatePasswordInput, validatePasswordId };
