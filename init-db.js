// File: init-db.js
// Purpose: Run this ONCE to set up your database tables.

require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
}).promise(); // Use promises for async/await

const setupDatabase = async () => {
    try {
        console.log('Dropping old tables (if they exist)...');
        await connection.query('DROP TABLE IF EXISTS password_history');
        await connection.query('DROP TABLE IF EXISTS passwords');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Creating new tables...');

        await connection.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "users" created.');

        await connection.query(`
            CREATE TABLE passwords (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                website VARCHAR(255) NOT NULL,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                iv VARCHAR(255) NOT NULL,
                category VARCHAR(50),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY user_website_username (user_id, website, username)
            )
        `);
        console.log('Table "passwords" created.');

        await connection.query(`
            CREATE TABLE password_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                password_id INT NOT NULL,
                user_id INT NOT NULL,
                password VARCHAR(255) NOT NULL,
                iv VARCHAR(255) NOT NULL,
                changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (password_id) REFERENCES passwords(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table "password_history" created.');

        console.log('✅ Database setup complete!');
        await connection.end();
    } catch (err) {
        console.error('Error during database setup:', err);
        await connection.end();
    }
};

setupDatabase();