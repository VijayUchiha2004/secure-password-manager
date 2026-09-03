# 🔒 Secure Password Manager

A full-stack, secure password manager built with Node.js, Express, and MySQL. This application features end-to-end user authentication with JWT and database-level encryption for all stored passwords.

## ✨ Features

* **Secure User Authentication:** Full registration and login system using **JWT** (JSON Web Tokens) and **bcrypt** for password hashing.
* **Database Encryption:** All passwords are encrypted on the server using authenticated **AES-256-GCM** before being stored in the database.
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
* **Encryption:** Node.js `crypto` (AES-256-GCM)
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

* [Node.js](https://nodejs.org/) (v18+)
* [MySQL](https://www.mysql.com/) Server

### 1. Clone the Repository

```sh
git clone https://your-repository-url.git
cd password-manager
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure the Environment

Copy `.env.example` to `.env` and replace every placeholder with production values.
`JWT_SECRET` must be long and random. `ENCRYPTION_KEY` must be exactly 32
characters and must never change after encrypted data has been stored.

New records use authenticated AES-256-GCM. Existing AES-256-CBC records remain
readable and are converted to GCM when they are updated.

### 4. Set Up the Database

Run this once against the target database. It is non-destructive and uses
`CREATE TABLE IF NOT EXISTS`.

```sh
node init-db.js
```

### 5. Start the Server

```sh
npm start
```

The server listens on `PORT` (default `3000`) and binds to `HOST` (default
`0.0.0.0`). Configure your platform health check to use `GET /health`.

## Production checklist

* Use a managed MySQL instance with TLS, backups, and a least-privilege database user.
* Set secrets through the host's secret manager; never commit `.env`.
* Serve the application behind HTTPS and a reverse proxy/load balancer.
  The app redirects production HTTP requests to HTTPS and enables HSTS.
* Restrict `CORS_ORIGIN` only when a separate frontend origin is required.
* Keep the frontend and API on the same HTTPS origin so the CSRF and auth cookies remain protected.
* The server sends a restrictive Content Security Policy; keep frontend scripts external and same-origin.
* Do not run `init-db.js` automatically on every deployment if schema migrations are introduced.