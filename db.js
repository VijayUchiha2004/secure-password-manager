// File: db.js
// Purpose: Manages the database connection.

const mysql = require('mysql2');
require('dotenv').config();
const getDatabaseOptions = require('./utils/databaseConfig');

const connection = mysql.createPool({
    ...getDatabaseOptions(),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('Connected to MySQL database.');

// Export the promise-based pool for async/await
module.exports = connection.promise();