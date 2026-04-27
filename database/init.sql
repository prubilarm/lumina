-- Sentendar Online Banking Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    sender_account_id INTEGER REFERENCES accounts(id),
    receiver_account_id INTEGER REFERENCES accounts(id),
    type VARCHAR(20) NOT NULL, -- 'deposit', 'transfer', 'withdrawal'
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Admin (optional, password should be hashed in code)
-- INSERT INTO users (full_name, email, password, role) VALUES ('Admin Sentendar', 'admin@sentendar.com', 'hashed_pw', 'admin');
