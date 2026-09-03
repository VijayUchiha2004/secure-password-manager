// File: utils/crypto.js
// Purpose: Holds encryption/decryption helper functions.

const crypto = require('crypto');
const logger = require('./logger');
require('dotenv').config();

const algorithm = 'aes-256-gcm';
const key = process.env.ENCRYPTION_KEY;

let keyBuffer;
if (key && /^[0-9a-f]{64}$/i.test(key)) {
    keyBuffer = Buffer.from(key, 'hex');
} else if (key && key.length === 32) {
    keyBuffer = Buffer.from(key);
} else {
    throw new Error('ENCRYPTION_KEY must be 64 hexadecimal characters or exactly 32 characters. Check your environment variables.');
}

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
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
            keyBuffer,
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