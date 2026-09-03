// File: utils/crypto.js
// Purpose: Holds encryption/decryption helper functions.

const crypto = require('crypto');
const logger = require('./logger');
require('dotenv').config();

const algorithm = 'aes-256-gcm';
const key = process.env.ENCRYPTION_KEY;

if (!key || key.length !== 32) {
    throw new Error('ENCRYPTION_KEY is missing or not 32 characters long. Check your .env file.');
}

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        iv: iv.toString('hex'),
        encryptedData: `${authTag.toString('hex')}:${encrypted.toString('hex')}`
    };
}

function decrypt(text) {
    try {
        const iv = Buffer.from(text.iv, 'hex');
        const [authTagHex, encryptedHex] = text.encryptedData.split(':');
        const encryptedText = Buffer.from(encryptedHex || authTagHex, 'hex');
        const decipher = crypto.createDecipheriv(
            encryptedHex ? algorithm : 'aes-256-cbc',
            Buffer.from(key),
            iv
        );
        if (encryptedHex) {
            decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
        }
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        logger.error('Decryption failed', { error: error.message });
        return "Decryption Error";
    }
}

module.exports = { encrypt, decrypt };