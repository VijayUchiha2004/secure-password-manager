# 🔒 Secure Password Manager

A full-stack, secure password manager built with Node.js, Express, and MySQL. This application features end-to-end user authentication with JWT and database-level encryption for all stored passwords.

## ✨ Features

* **Secure User Authentication:** Full registration and login system using **JWT** (JSON Web Tokens) and **bcrypt** for password hashing.
* **Database Encryption:** All passwords are encrypted on the server using Node.js's built-in `crypto` module (**AES-256**) before being stored in the database.
* **Full CRUD Functionality:**
    * **Create:** Add new password entries.
    * **Read:** View all your saved passwords.
    * **Update:** Edit existing password entries.
    * **Delete:** Remove passwords you no longer need.
* **Password History:** Automatically saves previous passwords when you update an entry, which you can view in a "History" modal.
* **Secure Client-Side Routing:** The main application page is protected. Users are automatically redirected to the login page if no valid token is present.
* **Password Utilities:**
    * Secure password generator.
    * Password strength checker.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Authentication:** JSON Web Tokens (JWT), bcrypt
* **Encryption:** Node.js `crypto` (AES-256-CBC)
* **Frontend:** HTML, CSS, Vanilla JavaScript (Fetch API)

## 🗂️ Project Structure

The project is organized into a clean, modular structure:  

password-manager/
├── public/
│   ├── css/
│   │   └── style.css   <-- Make sure it's here
│   └── js/
│       ├── login.js
│       ├── main.js
│       └── register.js
├── routes/
│   ├── auth.js
│   └── passwords.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   └── crypto.js
├── .env
├── db.js
├── init-db.js
├── server.js           
├── login.html
├── register.html
└── main.html

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v14+)
* [MySQL](https://www.mysql.com/) Server

### 1. Clone the Repository

```sh
git clone [https://your-repository-url.git](https://your-repository-url.git)
cd password-manager

2. Install Dependencies
npm install

3. Create Environment File
Create a .env file in the root of the project and add the following variables. This is mandatory.

Code snippet

# Database Credentials
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=password_manager

# Security Keys
JWT_SECRET=your_super_strong_and_random_jwt_secret
ENCRYPTION_KEY=your_32_character_long_encryption_key
IMPORTANT:

JWT_SECRET can be any long, random string.

ENCRYPTION_KEY MUST be exactly 32 characters long.

4.Set Up the Database
node init-db.js

5.Start the Server
npm start