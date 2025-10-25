// File: utils/crypto.js
// Purpose: Holds encryption/decryption helper functions.

const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY;

if (!key || key.length !== 32) {
    throw new Error('ENCRYPTION_KEY is missing or not 32 characters long. Check your .env file.');
}

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    try {
        const iv = Buffer.from(text.iv, 'hex');
        const encryptedText = Buffer.from(text.encryptedData, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption failed:", error);
        return "Decryption Error";
    }
}

module.exports = { encrypt, decrypt };